"use client";

import { useEffect } from "react";
import { useActivityStore } from "@/store/activityStore";

import ActivityFilters from "@/components/activity/ActivityFilters";
import ActivityList from "@/components/activity/ActivityList";


export default function UserActivityPage(){

 const {
   activities,
   loading,
   fetchUserActivity
 } = useActivityStore();


 useEffect(()=>{
    fetchUserActivity();
 },[]);



 return (
   <div className="space-y-5">

     <div>
       <h1 className="text-xl font-semibold">
          My Activity
       </h1>

       <p className="text-sm text-muted-foreground">
          Track your account activities
       </p>
     </div>


     <ActivityFilters
        onFilter={()=>fetchUserActivity()}
     />


     <ActivityList
        activities={activities}
        loading={loading}
     />


   </div>
 );

}