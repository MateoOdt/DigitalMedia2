import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
  name: string;
  index: number;
  icon: any;
  link: string;
}

interface Props {
  menu: MenuItem[];
  currentPath: string;
}

const AsideBar: React.FC<Props> = ({ currentPath, menu }) => {
  return (
    <aside className="flex flex-col w-auto  gap-y-4">
      <div className="flex flex-row items-center p-4 gap-x-2 ">
        <Image
          src="https://www.svgrepo.com/show/382106/male-avatar-boy-face-man-user-9.svg"
          alt="user avatar"
          width={25}
          height={25}
        />
        <p className="basis-2/4 text-primary-300 hidden md:flex">
          <code>username</code>
        </p>
      </div>
      <menu type="toolbar" className="text-primary-300 ml-6">
        <ol className="flex flex-col">
          {menu.map((item) => (
            <li key={item.index}>
              <Link
                href={item.link}
                className={`flex items-center gap-x-4 rounded-s ${
                  currentPath === item.link
                    ? "text-secondary-50 bg-white w-11/12 p-2 mx-4"
                    : "hover:bg-secondary-50 w-full p-2"
                }`}
              >
                {item.icon}
                <p className="hidden md:flex">{item.name}</p>
              </Link>
            </li>
          ))}
        </ol>
      </menu>
    </aside>
  );
};

export default AsideBar;
