import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ThreeDotMenu = ({ actions, align = "end", className }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`p-1 h-8 w-8 rounded-full ${className}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align}>
        {actions.map((action, idx) => (
          <DropdownMenuItem
            key={idx}
            onSelect={action.onSelect}
            className={
              action.destructive ? "text-red-600 focus:text-red-600" : ""
            }
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThreeDotMenu;
