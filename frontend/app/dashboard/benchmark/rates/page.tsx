import { redirect } from "next/navigation";

export default function RatesIndex() {
  redirect("/dashboard/benchmark/rates/overview");
}
