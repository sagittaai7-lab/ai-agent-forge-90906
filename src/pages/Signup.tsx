import React from "react";
import { Label } from "@/components/ui/label";
import { InputCustom } from "@/components/ui/input-custom";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { IconBrandGithub, IconBrandGoogle, IconRobot } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Account created!",
      description: "Welcome to AgentForge",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <IconRobot className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground text-center mb-2">
            Create your account
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Start building AI agents today
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First name</Label>
                <InputCustom id="firstname" placeholder="John" type="text" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last name</Label>
                <InputCustom id="lastname" placeholder="Doe" type="text" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <InputCustom id="email" placeholder="john@example.com" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <InputCustom id="password" placeholder="••••••••" type="password" required />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              Sign up
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button">
              <IconBrandGithub className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button variant="outline" type="button">
              <IconBrandGoogle className="h-4 w-4 mr-2" />
              Google
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
