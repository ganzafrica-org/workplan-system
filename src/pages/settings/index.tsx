import { NextPage } from 'next';
import Head from 'next/head';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
    Check,
    CreditCard,
    Key,
    Lock,
    MailIcon,
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';

const SettingsPage: NextPage = () => {
    const { user } = useAuth();

    return (
        <AppLayout>
            <Head>
                <title>Settings | GanzAfrica Workplan System</title>
            </Head>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                </div>

                <Tabs defaultValue="profile" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 lg:w-auto">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>
                                    Manage your personal information and profile settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" defaultValue={user?.name || "John Doe"} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue={user?.email || "john@example.com"} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Job Title</Label>
                                    <Input id="title" defaultValue="Program Manager" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input id="department" defaultValue="Programs" disabled />
                                    <p className="text-xs text-muted-foreground">
                                        Department can only be changed by an administrator
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <textarea
                                        id="bio"
                                        className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                        placeholder="Write a short bio..."
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save Changes</Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Picture</CardTitle>
                                <CardDescription>
                                    Upload a profile photo to personalize your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="relative h-24 w-24 rounded-full bg-muted flex items-center justify-center text-4xl text-muted-foreground overflow-hidden">
                                    {user?.name ? user.name.charAt(0) : "J"}
                                </div>
                                <div className="space-y-2">
                                    <Button variant="outline">Upload New Image</Button>
                                    <p className="text-xs text-muted-foreground">
                                        JPG, GIF or PNG. 1MB max size.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="account" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Security</CardTitle>
                                <CardDescription>
                                    Manage your password and account security settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input id="current-password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input id="new-password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input id="confirm-password" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Update Password</Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Two-Factor Authentication</CardTitle>
                                <CardDescription>
                                    Add additional security to your account with two-factor authentication
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">Authenticator App</div>
                                        <div className="text-sm text-muted-foreground">
                                            Use an authenticator app to generate one-time codes
                                        </div>
                                    </div>
                                    <Button variant="outline">
                                        <Key className="h-4 w-4 mr-2" />
                                        Setup
                                    </Button>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">Text Message</div>
                                        <div className="text-sm text-muted-foreground">
                                            Receive codes via SMS
                                        </div>
                                    </div>
                                    <Button variant="outline">
                                        <MailIcon className="h-4 w-4 mr-2" />
                                        Setup
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Active Sessions</CardTitle>
                                <CardDescription>
                                    Manage your active sessions across all devices
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium">Current Session</div>
                                            <div className="text-sm text-muted-foreground">
                                                Chrome on Windows • Kigali, Rwanda
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Started May 20, 2025 • Last active: Now
                                            </div>
                                        </div>
                                        <Badge>Current</Badge>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium">Mobile App</div>
                                            <div className="text-sm text-muted-foreground">
                                                GanzAfrica App on Android • Kigali, Rwanda
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Started May 19, 2025 • Last active: 2 hours ago
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            <Lock className="h-3 w-3 mr-2" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="destructive">Logout of All Devices</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>
                                    Control what notifications you receive and how they are delivered
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Email Notifications</h3>
                                    <div className="grid gap-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <div className="font-medium">New Tasks</div>
                                                <div className="text-sm text-muted-foreground">
                                                    When you are assigned a new task
                                                </div>
                                            </div>
                                            <Switch defaultChecked={true} />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <div className="font-medium">Workplan Approvals</div>
                                                <div className="text-sm text-muted-foreground">
                                                    When your workplan is approved or rejected
                                                </div>
                                            </div>
                                            <Switch defaultChecked={true} />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <div className="font-medium">Project Updates</div>
                                                <div className="text-sm text-muted-foreground">
                                                    When projects you are part of are updated
                                                </div>
                                            </div>
                                            <Switch defaultChecked={true} />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <div className="font-medium">Comments</div>
                                                <div className="text-sm text-muted-foreground">
                                                    When someone comments on your tasks
                                                </div>
                                            </div>
                                            <Switch defaultChecked={true} />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <div className="font-medium">Team Updates</div>
                                                <div className="text-sm text-muted-foreground">
                                                    When new members join your team or team details change
                                                </div>
                                            </div>
                                            <Switch defaultChecked={false} />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <div className="font-medium">Document Uploads</div>
                                                <div className="text-sm text-muted-foreground">
                                                    When new documents are uploaded to your projects
                                                </div>
                                            </div>
                                            <Switch defaultChecked={false} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save Preferences</Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Email Digest Settings</CardTitle>
                                <CardDescription>
                                    Configure your email digest frequency and content
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email Digest Frequency</Label>
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" id="daily" name="digest-frequency" defaultChecked />
                                            <Label htmlFor="daily">Daily (Morning summary of previous day)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" id="weekly" name="digest-frequency" />
                                            <Label htmlFor="weekly">Weekly (Monday morning summary of previous week)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" id="no-digest" name="digest-frequency" />
                                            <Label htmlFor="no-digest">No digest (Receive only individual notifications)</Label>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save Preferences</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </AppLayout>
    );
};

export default SettingsPage;

function Badge({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}