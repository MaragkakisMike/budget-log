import { useContext } from "react";
import { DrizzleContext } from "@/db/DrizzleContext";

export default function useDatabase() {
  return useContext(DrizzleContext);
}
