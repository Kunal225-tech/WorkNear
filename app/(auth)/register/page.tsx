"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/components/providers/I18nProvider";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // 1. Register with backend
      const response = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        toast.success("Account created successfully! Logging you in...");

        // 2. Automatically sign in
        const loginResult = await authService.login({
          email: data.email,
          password: data.password,
        });

        if (loginResult.ok) {
          router.push("/jobs");
          router.refresh();
        } else {
          toast.info("Please sign in with your new account credentials.");
          router.push("/login");
        }
      } else {
        toast.error(response.message || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to register. Email may already be in use.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await authService.loginWithGoogle();
    } catch (error: any) {
      toast.error("Failed to connect with Google.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-border/80">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{t("auth.createTitle")}</CardTitle>
        <CardDescription>
          {t("auth.registerDesc")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Google OAuth Button */}
        <Button
          variant="outline"
          type="button"
          disabled={isLoading || isGoogleLoading}
          onClick={handleGoogleLogin}
          className="w-full h-11 font-medium rounded-xl border-border/80 gap-2.5"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span>{t("auth.continueGoogle")}</span>
        </Button>

        <div className="relative flex items-center justify-center">
          <span className="w-full border-t border-border" />
          <span className="absolute bg-card px-3 text-xs text-muted-foreground uppercase font-semibold">
            {t("auth.or")}
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("auth.fullName")}</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className={`pl-9 h-11 rounded-xl ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={isLoading || isGoogleLoading}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`pl-9 h-11 rounded-xl ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={isLoading || isGoogleLoading}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-9 pr-10 h-11 rounded-xl ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  disabled={isLoading || isGoogleLoading}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-9 pr-10 h-11 rounded-xl ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  disabled={isLoading || isGoogleLoading}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-xl font-semibold gap-2 mt-2"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("auth.creatingAccount")}</span>
              </>
            ) : (
              <>
                <span>{t("auth.getStarted")}</span>
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center border-t border-border/60 pt-4 text-center text-sm text-muted-foreground">
        <div>
          {t("auth.hasAccount")} {" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            {t("auth.signIn")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
