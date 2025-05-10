"use client";

import { usePathname } from 'next/navigation';
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator } from './ui/breadcrumb';
import { MobileSidebar } from './Sidebar';

function BreadcrumbHeader() {
    const pathName = usePathname();
    const paths = pathName === "/" ? [""]: pathName.split("/");
    return (
        <div className="flex item-centers flex-start">
            <MobileSidebar />
            <Breadcrumb>
                <BreadcrumbList>
                    {paths.map((path,index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbItem>
                                <p className="text-center items-center">{path !== "" ? "> " :""}</p>
                                <BreadcrumbLink className="capitalize" href={`/${path}`}>
                                    {path === "" ? "home": path }
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}

export default BreadcrumbHeader;
