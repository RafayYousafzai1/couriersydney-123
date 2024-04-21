import { Stats, ManageSuburbs, ManageServices } from "@/components/Index";
import MinSerivesPrices from "@/components/management/MinSerivesPrices";
import GST from "@/components/management/GST";

export default function page() {
  return (
    <div>
      <Stats />
      {/* <ManageSuburbs /> */}
      <br />
      <ManageServices />
      <br />
      <MinSerivesPrices />
      <br />
      <GST />
    </div>
  );
}
