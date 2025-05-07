
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  link: string;
  color: string;
}

const StatsCard = ({ title, value, icon, description, link, color }: StatsCardProps) => {
  return (
    <Link to={link} className="block h-full">
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 border-none">
        <CardHeader className={`flex flex-row items-center justify-between pb-2 bg-gradient-to-r ${color} text-white p-4`}>
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            {icon}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-3xl font-bold mb-2">{value}</div>
          <p className="text-sm text-gray-500 mb-4">{description}</p>
          <Button variant="ghost" className="group p-0 h-auto text-pfcu-purple hover:text-pfcu-dark hover:bg-transparent">
            <span>Manage {title}</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StatsCard;
