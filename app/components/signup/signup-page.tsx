"use client"

import { useApp } from "@/app/lib/hooks/useApp"
import { SignUpProps } from "@/app/lib/types/signUpProps";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import Link from "next/link";

export const SignUp = () => {
    const { api } = useApp();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [focusedField, setFocusedField] = useState<string>("");
    const [signUpProps, setSignUpProps] = useState<SignUpProps>({
        email: "",
        name: "",
        password: "",
        userName: ""
    });

    const [passwordChecks, setPasswordChecks] = useState({
        minLength: false,
        hasNumber: false,
        hasUpperCase: false,
        hasLowerCase: false,
    });

    const validatePassword = (password: string) => {
        setPasswordChecks({
            minLength: password.length >= 8,
            hasNumber: /[0-9]/.test(password),
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignUpProps(prev => ({ ...prev, [name]: value }));
        
        if (name === "password") {
            validatePassword(value);
        }
        
        if (error) setError("");
    };

    const isFormValid = () => {
        return (
            signUpProps.name.trim().length > 0 &&
            signUpProps.userName.trim().length >= 3 &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpProps.email) &&
            passwordChecks.minLength &&
            passwordChecks.hasNumber &&
            passwordChecks.hasUpperCase &&
            passwordChecks.hasLowerCase
        );
    };

    const onSignUp = async () => {
        if (!isFormValid()) return;
        
        setLoading(true);
        setError("");
        
        try {
            const success = await api.user.signUp(signUpProps);
            
            if (success) {
                router.replace("/login");
            } else {
                setError("Registration failed. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            
            <div className="flex-1 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Create account
                        </h1>
                        <p className="text-muted-foreground">
                            Join us to start exploring
                        </p>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="border-red-200 bg-red-50">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-5">
                        
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Full name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="e.g., Your Name"
                                value={signUpProps.name}
                                onChange={handleChange}
                                onFocus={() => setFocusedField("name")}
                                onBlur={() => setFocusedField("")}
                                disabled={loading}
                                className="h-11 px-4"
                            />
                        </div>

                        
                        <div className="space-y-2">
                            <Label htmlFor="userName" className="text-sm font-medium">
                                Username
                            </Label>
                            <Input
                                id="userName"
                                name="userName"
                                type="text"
                                placeholder="Username"
                                value={signUpProps.userName}
                                onChange={handleChange}
                                onFocus={() => setFocusedField("username")}
                                onBlur={() => setFocusedField("")}
                                disabled={loading}
                                className="h-11 px-4"
                            />
                            {focusedField === "username" && signUpProps.userName && (
                                <p className="text-xs text-muted-foreground">
                                    {signUpProps.userName.length < 3 
                                        ? "At least 3 characters" 
                                        : "Username available"}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="hello@example.com"
                                value={signUpProps.email}
                                onChange={handleChange}
                                onFocus={() => setFocusedField("email")}
                                onBlur={() => setFocusedField("")}
                                disabled={loading}
                                className="h-11 px-4"
                            />
                        </div>

                        
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={signUpProps.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField("password")}
                                    onBlur={() => setFocusedField("")}
                                    disabled={loading}
                                    className="h-11 px-4 pr-11"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            
                            {focusedField === "password" && signUpProps.password && (
                                <div className="mt-3 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        {passwordChecks.minLength ? (
                                            <Check className="h-3.5 w-3.5 text-green-500" />
                                        ) : (
                                            <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
                                        )}
                                        <span className={passwordChecks.minLength ? "text-green-600" : "text-muted-foreground"}>
                                            At least 8 characters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {passwordChecks.hasNumber ? (
                                            <Check className="h-3.5 w-3.5 text-green-500" />
                                        ) : (
                                            <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
                                        )}
                                        <span className={passwordChecks.hasNumber ? "text-green-600" : "text-muted-foreground"}>
                                            Contains a number
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {passwordChecks.hasUpperCase ? (
                                            <Check className="h-3.5 w-3.5 text-green-500" />
                                        ) : (
                                            <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
                                        )}
                                        <span className={passwordChecks.hasUpperCase ? "text-green-600" : "text-muted-foreground"}>
                                            Uppercase letter
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {passwordChecks.hasLowerCase ? (
                                            <Check className="h-3.5 w-3.5 text-green-500" />
                                        ) : (
                                            <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
                                        )}
                                        <span className={passwordChecks.hasLowerCase ? "text-green-600" : "text-muted-foreground"}>
                                            Lowercase letter
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        
                        <Button
                            onClick={onSignUp}
                            disabled={loading || !isFormValid()}
                            className="w-full h-11 mt-2"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Creating account..." : "Sign up"}
                        </Button>

                        
                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-foreground hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 to-slate-800 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2073&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <div className="relative z-10 max-w-md text-center text-white">
                    <div className="text-6xl mb-6">🗺️</div>
                    <h2 className="text-3xl font-semibold mb-4">
                        KUNIMO
                    </h2>
                    <p className="text-white/70">
                        Join our community of explorers and contributors. 
                    </p>
                </div>
            </div>
        </div>
    );
};