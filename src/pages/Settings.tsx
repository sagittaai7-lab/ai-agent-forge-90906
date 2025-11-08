import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background dark flex w-full">
      <AppSidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="container max-w-4xl mx-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="api">API Keys</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstname">First Name</Label>
                        <Input id="firstname" defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastname">Last Name</Label>
                        <Input id="lastname" defaultValue="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john@example.com" />
                    </div>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current">Current Password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new">New Password</Label>
                      <Input id="new" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm">Confirm Password</Label>
                      <Input id="confirm" type="password" />
                    </div>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      Update Password
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="api" className="space-y-6">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage your API keys for integrations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Production Key</Label>
                      <div className="flex gap-2">
                        <Input value="sk_prod_••••••••••••••••" readOnly />
                        <Button variant="outline">Copy</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Development Key</Label>
                      <div className="flex gap-2">
                        <Input value="sk_dev_••••••••••••••••" readOnly />
                        <Button variant="outline">Copy</Button>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      Generate New Key
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Manage your subscription</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">Pro Plan</p>
                        <p className="text-muted-foreground">$29/month</p>
                      </div>
                      <Button variant="outline">Change Plan</Button>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-2">Usage this month</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>API Requests</span>
                          <span>2,522 / 10,000</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-accent w-1/4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
