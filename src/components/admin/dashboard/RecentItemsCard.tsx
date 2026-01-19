
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface RecentItemsCardProps {
  title: string;
  titleIcon: React.ReactNode;
  headerColor: string;
  linkUrl: string;
  linkText: string;
  isLoading: boolean;
  emptyState: {
    icon: React.ReactNode;
    message: string;
    linkUrl: string;
    linkText: string;
  };
  renderItems: () => React.ReactNode;
}

const RecentItemsCard = ({
  title,
  titleIcon,
  headerColor,
  linkUrl,
  linkText,
  isLoading,
  emptyState,
  renderItems,
}: RecentItemsCardProps) => {
  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 h-full flex flex-col hover:shadow-md transition-all duration-300">
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <CardTitle className="flex items-center text-lg font-bold text-zinc-900 dark:text-zinc-100">
          <div className={`mr-2 p-1.5 rounded-md text-white ${headerColor.replace("from-", "bg-").split(" ")[0]}`}>
            {titleIcon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6 flex-grow">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-pfcu-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : renderItems() || (
          <div className="text-center py-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700">
            <div className="flex justify-center text-zinc-400 mb-2">
              {emptyState.icon}
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">{emptyState.message}</p>
            <Link to={emptyState.linkUrl}>
              <Button variant="link" className="h-auto p-0 text-pfcu-primary text-sm font-medium hover:underline">{emptyState.linkText}</Button>
            </Link>
          </div>
        )}
        <div className="pt-4 mt-auto">
          <Link to={linkUrl} className="block">
            <Button variant="outline" className="w-full border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-pfcu-primary hover:border-pfcu-primary/50 group">
              <span>{linkText}</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentItemsCard;
