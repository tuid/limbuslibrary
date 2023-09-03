import React from "react";
import { Footer } from "../components/footer/Footer";
import { Header } from "../components/header/Header";
import { LeftMenu } from "../components/left-menu/LeftMenu";

export const EGOPage:React.FC = () => {
    return  <>
        <Header></Header>
        <LeftMenu></LeftMenu>
        <main className={"global-content-wrapper"}>
        </main>
        <Footer></Footer>
    </>
}