"use client";

import {
  Activity,
  CalendarDays,
  Clock,
  TrendingUp,
} from "lucide-react";

import {
  useActivityStore
} from "@/store/activityStore";


export default function ActivityStats(){

  const { stats } = useActivityStore();


  if(!stats){
    return null;
  }


  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


      {/* Total Activities */}
      <div className="rounded-xl border bg-background p-4">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs text-muted-foreground">
              Total Activities
            </p>

            <h3 className="text-2xl font-semibold mt-1">
              {stats.total}
            </h3>

          </div>


          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
            <Activity className="h-4 w-4 text-blue-600"/>
          </div>


        </div>

      </div>



      {/* Today */}
      <div className="rounded-xl border bg-background p-4">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs text-muted-foreground">
              Today
            </p>

            <h3 className="text-2xl font-semibold mt-1">
              {stats.today}
            </h3>

          </div>


          <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">

            <Clock className="h-4 w-4 text-green-600"/>

          </div>


        </div>

      </div>




      {/* This Week */}
      <div className="rounded-xl border bg-background p-4">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs text-muted-foreground">
              This Week
            </p>


            <h3 className="text-2xl font-semibold mt-1">
              {stats.this_week}
            </h3>


          </div>


          <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">

            <CalendarDays className="h-4 w-4 text-purple-600"/>

          </div>


        </div>

      </div>




      {/* Most Active */}
      <div className="rounded-xl border bg-background p-4">


        <div className="flex items-center justify-between">


          <div>

            <p className="text-xs text-muted-foreground">
              Top Activity
            </p>


            <h3 className="text-sm font-semibold mt-2 capitalize">

              {
                Object.keys(stats.by_type || {})
                .sort(
                  (a,b)=>
                  stats.by_type[b]-stats.by_type[a]
                )[0] || "N/A"
              }

            </h3>


          </div>


          <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">

            <TrendingUp className="h-4 w-4 text-orange-600"/>

          </div>


        </div>


      </div>



    </div>

  );

}