"use client";


import { useEffect } from "react";

import {
 useActivityStore
} from "@/store/activityStore";


import ActivityFilters from "@/components/activity/ActivityFilters";
import ActivityList from "@/components/activity/ActivityList";
import ActivityStats from "@/components/activity/ActivityStats"; 

export default function AdminActivityPage(){


 const {
   adminActivities,
   adminLoading,
   fetchAdminActivity,
   fetchStats
 } = useActivityStore();



 useEffect(()=>{

    fetchAdminActivity();
    fetchStats();

 },[]);



 return (

 <div className="space-y-5">


   <div>

     <h1 className="text-xl font-semibold">
       Admin Activity Logs
     </h1>


     <p className="text-sm text-muted-foreground">
       Monitor all user and system actions
     </p>

   </div>

 <ActivityStats />

   <ActivityFilters
       isAdmin
       onFilter={()=>fetchAdminActivity()}
   />



   <ActivityList

       activities={adminActivities}

       loading={adminLoading}

       showUser

   />


 </div>

 );

}