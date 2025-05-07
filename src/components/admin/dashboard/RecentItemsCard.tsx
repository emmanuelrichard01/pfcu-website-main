
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
    <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className={`bg-gradient-to-r ${headerColor} border-b`}>
        <CardTitle className="flex items-center">
          {titleIcon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : renderItems() || (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            {emptyState.icon}
            <p className="text-gray-500">{emptyState.message}</p>
            <Link to={emptyState.linkUrl}>
              <Button variant="link" className="mt-2">{emptyState.linkText}</Button>
            </Link>
          </div>
        )}
        <Link to={linkUrl} className="block">
          <Button variant="outline" className="w-full mt-2 group">
            <span>{linkText}</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default RecentItemsCard;
