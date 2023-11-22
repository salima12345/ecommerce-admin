import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Card from "@/components/Card";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import User from "@/models/User";

import mongoose from "mongoose";
import { mongooseConnect } from "@/lib/mongoose";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { BiMoneyWithdraw } from "react-icons/bi";
import { BsFillPersonCheckFill } from "react-icons/bs";




export default function Home({totalProducts,totalOrders,totalUsers}) {
  const {data:session}=useSession()
  if(!session) return;
 return <Layout>
  
  <div className="text-black">
<h2>
hello,<b>{session?.user?.name}</b>

</h2>
  </div>
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7">
  <Card
          data={totalProducts}
          icon={<MdOutlineProductionQuantityLimits size={25} />}
          label={"Total Products"}
        />
        
         <Card
          data={totalOrders}
          icon={<BiMoneyWithdraw size={25} />}
          label={"Total Sales"}
        />
         <Card
          data={totalUsers}
          icon={<BsFillPersonCheckFill size={25} />}
          label={"Total Users"}
        />

  </div>
 
  </Layout>
}
export  async function getServerSideProps(){

  await mongooseConnect();
  const totalProducts = await Product.countDocuments({});
  const totalOrders = await Order.countDocuments({ paid: true });
  const totalUsers = await User.countDocuments({});


  return {
    props: {
      totalProducts,
      totalOrders,
      totalUsers,

    },
  };


}