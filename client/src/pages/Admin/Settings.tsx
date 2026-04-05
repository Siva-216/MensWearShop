import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard, 
  Save, 
  Mail, 
  Lock, 
  Eye, 
  Languages, 
  Database, 
  Smartphone, 
  LogOut, 
  History, 
  HelpCircle, 
  ChevronRight, 
  Palette, 
  Store
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div>
        <h2 className="text-4xl font-display font-black tracking-tight text-foreground">Global Settings</h2>
        <p className="text-muted-foreground mt-2 text-lg">Control your admin environment and store configurations.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="h-14 bg-muted/30 p-1 mb-8 rounded-2xl w-full flex overflow-x-auto no-scrollbar border border-muted-foreground/10 shadow-sm backdrop-blur-md sticky top-20 z-10 transition-all">
          <TabsTrigger value="general" className="rounded-xl flex-1 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all">
            <Store size={16} /> General
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-xl flex-1 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all">
            <User size={16} /> Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl flex-1 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all">
            <Shield size={16} /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl flex-1 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all">
            <Bell size={16} /> Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-xl flex-1 font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all">
            <Palette size={16} /> Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/10 pb-8 pt-8 px-8">
              <CardTitle className="text-2xl font-black">Store Configuration</CardTitle>
              <CardDescription className="text-base">Identity and basic information of your retail platform.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-medium">
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Store Name</Label>
                  <Input placeholder="FashionWorld Official" className="h-12 rounded-xl bg-card border-muted focus-visible:ring-1 focus-visible:ring-primary shadow-sm" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Support Email</Label>
                  <Input placeholder="support@fashionworld.com" className="h-12 rounded-xl bg-card border-muted focus-visible:ring-1 focus-visible:ring-primary shadow-sm" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Contact Phone</Label>
                  <Input placeholder="+1 234 567 890" className="h-12 rounded-xl bg-card border-muted focus-visible:ring-1 focus-visible:ring-primary shadow-sm" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Vat/Tax ID</Label>
                  <Input placeholder="US-12345678" className="h-12 rounded-xl bg-card border-muted focus-visible:ring-1 focus-visible:ring-primary shadow-sm" />
                </div>
              </div>
              
              <div className="pt-4 flex items-center justify-between border-t border-muted/50 mt-4">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Globe size={20} /></div>
                   <div>
                     <p className="font-bold text-foreground">Maintenance Mode</p>
                     <p className="text-sm text-muted-foreground">Temporarily disable the storefront for maintenance.</p>
                   </div>
                 </div>
                 <Switch />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
             <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold uppercase tracking-widest text-xs">Reset Changes</Button>
             <Button className="h-14 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primary/20 bg-foreground text-background">
               <Save size={18} /> Save Configurations
             </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-6">
           <Card className="border-none shadow-sm overflow-hidden bg-card/50">
             <CardHeader className="bg-muted/10 pb-8 pt-8">
               <CardTitle className="text-2xl font-black">Personal Information</CardTitle>
               <CardDescription>Your details as an administrator.</CardDescription>
             </CardHeader>
             <CardContent className="p-8 flex flex-col md:flex-row gap-12">
                <div className="flex flex-col items-center gap-4">
                   <div className="h-32 w-32 rounded-3xl bg-muted overflow-hidden border-4 border-card shadow-2xl relative group">
                      <img src="https://github.com/shadcn.png" alt="Profile" className="h-full w-full object-cover group-hover:scale-110 transition-transform cursor-pointer" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="text-white"><Edit2 size={24} /></Button>
                      </div>
                   </div>
                   <Button variant="outline" size="sm" className="font-bold text-[10px] uppercase tracking-tighter">Change Avatar</Button>
                </div>
                <div className="flex-1 space-y-6 font-medium">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                        <Input defaultValue="Admin FashionWorld" className="h-12 bg-card border-muted rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Admin Username</Label>
                        <Input defaultValue="@fashion_admin" className="h-12 bg-card border-muted rounded-xl" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Bio / Internal Note</Label>
                      <textarea className="w-full h-32 p-4 bg-card border border-muted rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-all" placeholder="Tell us about yourself..."></textarea>
                   </div>
                   <Button className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-xs gap-3 float-right bg-foreground text-background">
                     Update Profile
                   </Button>
                </div>
             </CardContent>
           </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Contrast Mode', desc: 'Increase readability of UI elements.', icon: Eye },
                { title: 'Animation Style', desc: 'Set the speed of interface transitions.', icon: History },
                { title: 'Density', desc: 'Choose between compact or spacious layout.', icon: Database },
                { title: 'Color Theme', desc: 'Switch between light and dark visual modes.', icon: Palette },
              ].map((item, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-lg transition-all p-6 group cursor-pointer bg-card/50">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-muted rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all"><item.icon size={22} /></div>
                        <div>
                          <p className="font-bold text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                   </div>
                </Card>
              ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Edit2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>;

export default SettingsPage;
