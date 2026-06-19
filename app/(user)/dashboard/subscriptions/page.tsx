"use client";

import SubscriptionCard from "@/components/user/SubscriptionCard";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export default function SubscriptionPage() {

  const { subscriptions } = useSubscriptionStore();


  return (
    <div className="p-6">

      <h1 className="text-xl font-semibold mb-5">
        Subscriptions
      </h1>


      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {subscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
          />
        ))}

      </div>


    </div>
  );
}