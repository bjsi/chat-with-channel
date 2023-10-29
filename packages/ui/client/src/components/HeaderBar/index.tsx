import { GithubOutlined } from "@ant-design/icons";
import { Layout, Space, Typography } from "antd";
import React from "react";

const { Link } = Typography;

const { Header } = Layout;

export const HEADER_HEIGHT = 48;

export const HeaderBar = () => {
  return (
    <>
      <Header
        className="fixed inset-0 flex items-center w-full px-4 py-0"
        style={{
          zIndex: 19,
          lineHeight: "48px",
          backgroundColor: "#001529",
          height: `${HEADER_HEIGHT}px`,
          maxHeight: `${HEADER_HEIGHT}px`,
          minHeight: `${HEADER_HEIGHT}px`,
        }}
      >
        <div className={"h-[100%] flex items-center"}>
          <Link href="/">
            <div className="text-3xl">AI Popper</div>
          </Link>
        </div>
        <Space className={"flex ml-auto h-full overflow-hidden"} size={0}>
          <span className={"flex ml-auto h-full overflow-hidden"}>
            <Link
              className={
                "flex items-center h-12 py-0 px-3 text-white cursor-pointer transition-all ease-out duration-300 hover:bg-[#252a3d]"
              }
              href="https://github.com/bjsi/ai-popper"
              target="_blank"
            >
              <GithubOutlined />
            </Link>
          </span>
        </Space>
      </Header>
      <div className={"h-[48px]"} />
    </>
  );
};
