import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { IconRobot, IconSparkles, IconBolt, IconShield } from "@tabler/icons-react";
import { motion } from "framer-motion";

const Landing = () => {
  const features = [
    {
      icon: <IconSparkles className="h-6 w-6" />,
      title: "Intelligent Agents",
      description: "Create AI agents with advanced capabilities and custom instructions"
    },
    {
      icon: <IconBolt className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Deploy and manage agents in seconds with our streamlined platform"
    },
    {
      icon: <IconShield className="h-6 w-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for your AI agents and data"
    }
  ];

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <IconRobot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl text-foreground">AgentForge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Build Powerful AI Agents in Minutes
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Create, deploy, and manage intelligent AI agents with our intuitive platform. 
            No coding required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                Start Building Free
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Hero Image/Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full" />
          <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="bg-muted/50 rounded-lg p-6 space-y-3"
                >
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Everything you need to build AI agents
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features to bring your AI vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 text-primary-foreground">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-primary-foreground">
            Ready to get started?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join thousands of developers building the future with AI agents
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="bg-background hover:bg-background/90">
              Create Your First Agent
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 AgentForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
