"use client";

import React, { useState, useEffect } from 'react';
import { AlertCircle, Archive, ArchiveX, File, Inbox, MessagesSquare, Search, Send, ShoppingCart, Trash2, Users2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccountSwitcher } from "@/app/mail/components/account-switcher";
import { MailDisplay } from "@/app/mail/components/mail-display";
import { MailList } from "@/app/mail/components/mail-list";
import { Nav } from "@/app/mail/components/nav";
import { mails as initialMails } from "@/app/mail/data";

export function Mail({ accounts, mails = initialMails, defaultLayout = [20, 32, 48], defaultCollapsed = false, navCollapsedSize }) {
	const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
	const [selectedMailId, setSelectedMailId] = useState(null);  /* 2024-08-17 */

	return (
		<TooltipProvider delayDuration={0}>
			<ResizablePanelGroup
				direction="horizontal"
				onLayout={(sizes) => {
					document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(sizes)}`;
				}}
				className="h-full max-h-[100vh] items-stretch"
			>
				<ResizablePanel
					defaultSize={defaultLayout[0]}
					collapsedSize={navCollapsedSize}
					collapsible={true}
					minSize={15}
					maxSize={20}
					onCollapse={() => {
						setIsCollapsed(true);
						document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
					}}
					onResize={() => {
						setIsCollapsed(false);
						document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
					}}
					className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
				>
					<div className={cn("flex h-[56px] items-center justify-center", isCollapsed ? "h-[56px]" : "px-2")}>
						<AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
					</div>
					<Separator />
					<Nav
						isCollapsed={isCollapsed}
						links={[
							{
								title: "받은 메일함",
								label: "128",
								icon: Inbox,
								variant: "default",
							},
							{
								title: "임시 보관함",
								label: "9",
								icon: File,
								variant: "ghost",
							},
							{
								title: "보낸 메일함",
								label: "",
								icon: Send,
								variant: "ghost",
							},
							{
								title: "스팸 메일함",
								label: "23",
								icon: ArchiveX,
								variant: "ghost",
							},
							{
								title: "휴지통",
								label: "",
								icon: Trash2,
								variant: "ghost",
							},
							{
								title: "보관",
								label: "",
								icon: Archive,
								variant: "ghost",
							},
						]}
					/>
					<Separator />
					<Nav
						isCollapsed={isCollapsed}
						links={[
							{
								title: "SNS",
								label: "972",
								icon: Users2,
								variant: "ghost",
							},
							{
								title: "업데이트",
								label: "342",
								icon: AlertCircle,
								variant: "ghost",
							},
							{
								title: "포럼",
								label: "128",
								icon: MessagesSquare,
								variant: "ghost",
							},
							{
								title: "쇼핑",
								label: "8",
								icon: ShoppingCart,
								variant: "ghost",
							},
							{
								title: "프로모션",
								label: "21",
								icon: Archive,
								variant: "ghost",
							},
						]}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={defaultLayout[1]} minSize={30} className={cn(selectedMailId ? "hidden" : "block", "md:block")}> {/* 2024-08-17 */}
					<Tabs defaultValue="all">
						<div className="flex items-center px-4 py-2">
							<h1 className="text-xl font-bold">받은 메일함</h1>
							<TabsList className="ml-auto">
								<TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
									전체 메일
								</TabsTrigger>
								<TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">
									안읽은 메일
								</TabsTrigger>
							</TabsList>
						</div>
						<Separator />
						<div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
							<form>
								<div className="relative">
									<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input placeholder="메일 검색" className="pl-8" />
								</div>
							</form>
						</div>
						<TabsContent value="all" className="m-0">
							{/* 전체 메일 리스트를 필터링하여 MailList 컴포넌트로 전달 */}
							<MailList items={mails} selectedMailId={selectedMailId} setSelectedMailId={setSelectedMailId}/>
						</TabsContent>
						<TabsContent value="unread" className="m-0">
							{/* 읽지 않은 메일 리스트를 필터링하여 MailList 컴포넌트로 전달 */}
							<MailList items={mails.filter((item) => !item.read)} selectedMailId={selectedMailId} setSelectedMailId={setSelectedMailId}/>
						</TabsContent>
					</Tabs>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={ defaultLayout[2]} className={cn(selectedMailId ? "block" : "hidden", "md:block")}> {/* 2024-08-17 */}
					{/* 선택된 메일을 찾아 MailDisplay 컴포넌트로 전달 */}
					<MailDisplay mail={mails.find((item) => item.id === selectedMailId) || null} setSelectedMailId={setSelectedMailId}/> {/* 2024-08-17 */}
				</ResizablePanel>
			</ResizablePanelGroup>
		</TooltipProvider>
	);
}
