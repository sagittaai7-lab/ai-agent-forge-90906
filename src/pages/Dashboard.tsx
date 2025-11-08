import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPlus, IconRobot, IconDots } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const agents = [
    {
      id: 1,
      name: "Customer Support Bot",
      description: "Handles customer inquiries and support tickets",
      status: "active",
      requests: 1234
    },
    {
      id: 2,
      name: "Data Analyzer",
      description: "Analyzes and summarizes large datasets",
      status: "active",
      requests: 856
    },
    {
      id: 3,
      name: "Content Generator",
      description: "Creates marketing copy and social media posts",
      status: "inactive",
      requests: 432
    }
  ];

  return (
    <div className="min-h-screen bg-background dark flex w-full">
      <AppSidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Agents</h1>
              <p className="text-muted-foreground">Manage and monitor your AI agents</p>
            </div>
            <Link to="/create-agent">
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                <IconPlus className="h-4 w-4 mr-2" />
                Create Agent
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-2xl">3</CardTitle>
                  <CardDescription>Total Agents</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-2xl">2,522</CardTitle>
                  <CardDescription>Total Requests</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-2xl">2</CardTitle>
                  <CardDescription>Active Agents</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>

          {/* Agents List */}
          <div className="space-y-4">
            {agents.map((agent, idx) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
              >
                <Card className="border-border bg-card hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                          <IconRobot className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">{agent.name}</h3>
                          <p className="text-muted-foreground mb-3">{agent.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                              {agent.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-muted-foreground">{agent.requests.toLocaleString()} requests</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <IconDots className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
