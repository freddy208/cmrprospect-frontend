"use client";

import { motion } from "framer-motion";
import UserCard from "./UserCard";
import { IUser } from "@/types/user";

interface UsersGridProps {
  users: IUser[];
  onDelete: (user: IUser) => void;
}

export default function UsersGrid({ users, onDelete }: UsersGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {users.map((user) => (
        <UserCard key={user.id} user={user} onDelete={onDelete} />
      ))}
    </motion.div>
  );
}