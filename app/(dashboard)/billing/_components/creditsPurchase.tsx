"use client";
import { PurchaseCredits } from "@/actions/billing/purchaseCredits";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditsPacks, PackId } from "@/types/billing";
import { useMutation } from "@tanstack/react-query";
import { CoinsIcon, CreditCardIcon } from "lucide-react";
import React, { useState } from "react";

function CreditsPurchase() {
  const [selectedPack, setSelectedPack] = useState(PackId.MEDIUM);

  const mutation = useMutation({
    mutationFn: PurchaseCredits,
    onSuccess: () => {},
    onError: () => {}
  })

  return (
    <Card>
      <CardHeader className="text-2xl font-bold flex items-center gap-2">
        <CoinsIcon className="h-6 w-6 text-primary" />
        <CardTitle>Purchase Credits</CardTitle>
        <CardDescription>
          Select the number of credits you want to purchase
        </CardDescription>
        <CardContent>
          <RadioGroup
            onValueChange={(value) => {
              setSelectedPack(value as PackId);
            }}
            value={selectedPack}
          >
            {CreditsPacks.map((pack) => (
              <div
                key={pack.id}
                className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary"
                onClick={() => setSelectedPack(pack.id)}
              >
                <RadioGroupItem value={pack.id} id={pack.id} />
                <Label className="flex justify-between w-full cursor-pointer">
                  <span className="font-medium">
                    {pack.name} - {pack.label}
                  </span>
                  <span className="font-bold text-primary">
                    ₹{(pack.price)}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={mutation.isPending} onClick={() => {
            mutation.mutate(selectedPack);
          }}>
            <CreditCardIcon className="mr-2 h-5 w-6" /> Purchase credits
          </Button>
        </CardFooter>
      </CardHeader>
    </Card>
  );
}

export default CreditsPurchase;
