"use client"
import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Button } from '../ui/button';
import { Moon, Sun, ShoppingBasket, Table } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import { Badge } from "@/components/ui/badge"



function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    return (
        <Button
            title='Color Theme  '
            variant="secondary"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-9 w-9"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

const Header = () => {
    const paths = usePathname().split("/")
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border bg-background dark:bg-background px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {
                            paths.map((path, i) => <div key={`${path}-${i}`} className='flex items-center'>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink className='capitalize' href={`/${path}` || "/orders/pos"}>
                                        {path?.toLocaleLowerCase() || "Dashboard"}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                            </div>)
                        }

                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className=' flex gap-2'>
                <Link href={`/space`}>
                    <Button size={'icon'} variant={'secondary'} title='Table'>
                        <Table />
                    </Button>
                </Link>
                <Link href={`/orders/pos`}>
                    <Button size={'icon'} variant={'secondary'} className=' relative' title='POS'>
                        <ShoppingBasket />
                        <Badge
                            className="h-5 -top-3 -right-2 absolute min-w-5 rounded-full px-1 items-center justify-center  font-mono tabular-nums text-green-700 ring-1 dark:text-green-300"
                            variant="outline"
                        >
                            20
                        </Badge>
                    </Button>
                </Link>

                <ThemeToggle />
            </div>
        </header>
    );
};

export default Header;