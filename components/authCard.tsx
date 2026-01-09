"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useActionState } from "react";

import { checkLogin, registerAcc } from "@/app/actions/auth";

type CardType = "login" | "register";

function SubmitButton({
  pending,
  children,
  className,
}: {
  pending: boolean;
  children: string;
  className?: string;
}) {
  return (
    <Button type="submit" disabled={pending} className={className}>
      {pending && <Spinner />}
      {pending ? `${children}...` : children}
    </Button>
  );
}

export default function AuthCard({ cardType }: { cardType: CardType }) {
  const _cardtype = cardType.charAt(0).toUpperCase() + cardType.slice(1);

  const actionFn = cardType === "register" ? registerAcc : checkLogin;
  const [state, formAction, isPending] = useActionState(actionFn, null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-2xl">{_cardtype}</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={formAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-4">
              <Label htmlFor="username">User</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="User"
                required
              />
            </div>

            <div className="grid gap-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </div>

          <SubmitButton pending={isPending} className="w-full mt-10">
            {_cardtype}
          </SubmitButton>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-4">
        {state && !state.ok && (
          <span className="text-red-500">{String(state.msg)}</span>
        )}
        {state && state.ok && (
          <span className="text-green-600">{String(state.msg)}</span>
        )}
      </CardFooter>
    </Card>
  );
}