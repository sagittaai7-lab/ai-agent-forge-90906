import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { IconRobot } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const CreateAgent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Agent created!",
      description: "Your AI agent has been successfully created",
    });
    navigate("/dashboard");
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Create New Agent</h1>
              <p className="text-muted-foreground">Configure your AI agent with custom capabilities</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Basic Info */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Give your agent a name and description</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Agent Name</Label>
                      <Input id="name" placeholder="e.g., Customer Support Bot" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="What does this agent do?"
                        rows={3}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Configuration */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Set up your agent's capabilities and behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="model">AI Model</Label>
                      <Select defaultValue="gpt4">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt4">GPT-4</SelectItem>
                          <SelectItem value="gpt35">GPT-3.5</SelectItem>
                          <SelectItem value="claude">Claude 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">System Instructions</Label>
                      <Textarea 
                        id="instructions" 
                        placeholder="Provide detailed instructions for your agent's behavior..."
                        rows={5}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature (Creativity)</Label>
                      <Input 
                        id="temperature" 
                        type="number" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        defaultValue="0.7"
                      />
                      <p className="text-sm text-muted-foreground">
                        Higher values make output more random, lower values more focused
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Features</CardTitle>
                    <CardDescription>Enable additional capabilities for your agent</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Web Search</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow agent to search the web for information
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Code Execution</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable agent to write and execute code
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Image Generation</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow agent to generate images
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Memory</Label>
                        <p className="text-sm text-muted-foreground">
                          Remember previous conversations
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  >
                    <IconRobot className="h-4 w-4 mr-2" />
                    Create Agent
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CreateAgent;
