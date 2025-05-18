'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  userType: z.string({
    required_error: "Please select a user type.",
  }),
});

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      userType: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFormState('submitting');
    
    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setFormState('success');
      form.reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setFormState('idle');
      }, 5000);
    }, 1500);
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions about EdPsych Connect? We're here to help. Reach out to our team for support, information, or partnership inquiries.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Our Location</h3>
                  <p className="text-muted-foreground mt-1">123 Education Lane</p>
                  <p className="text-muted-foreground">London, UK EC1A 1BB</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Phone</h3>
                  <p className="text-muted-foreground mt-1">+44 20 1234 5678</p>
                  <p className="text-muted-foreground">Monday to Friday, 9am to 5pm</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Email</h3>
                  <p className="text-muted-foreground mt-1">info@edpsychconnect.com</p>
                  <p className="text-muted-foreground">support@edpsychconnect.com</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Hours</h3>
                  <p className="text-muted-foreground mt-1">Monday to Friday: 9am - 5pm</p>
                  <p className="text-muted-foreground">Saturday: 10am - 2pm (Online Support Only)</p>
                  <p className="text-muted-foreground">Sunday: Closed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
          
          <Card>
            <CardContent className="p-6">
              {formState === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-8"
                >
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground max-w-md">
                    Thank you for contacting us. We've received your message and will respond as soon as possible.
                  </p>
                </motion.div>
              ) : formState === 'error' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-8"
                >
                  <div className="bg-red-100 p-3 rounded-full mb-4">
                    <AlertCircle className="h-12 w-12 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Something went wrong</h3>
                  <p className="text-muted-foreground max-w-md">
                    We couldn't send your message. Please try again or contact us directly via email or phone.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setFormState('idle')}
                  >
                    Try Again
                  </Button>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>I am a</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your user type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="educator">Educator</SelectItem>
                              <SelectItem value="professional">Educational Professional</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Message subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your message" 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={formState === 'submitting'}
                    >
                      {formState === 'submitting' ? (
                        <>Sending Message...</>
                      ) : (
                        <>
                          Send Message <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-20"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">How can I get started with EdPsych Connect?</h3>
              <p className="text-muted-foreground">
                Getting started is easy! Simply register for an account, complete your profile, and you'll have immediate access to our platform's features tailored to your role as a student, parent, or educator.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Is EdPsych Connect available for schools and institutions?</h3>
              <p className="text-muted-foreground">
                Yes, we offer institutional licenses for schools, educational authorities, and professional organizations. Contact our team for information about bulk licensing and custom implementations.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">How does EdPsych Connect protect user data?</h3>
              <p className="text-muted-foreground">
                We take data protection seriously. EdPsych Connect is fully GDPR compliant and implements robust security measures to protect all user data, with particular attention to safeguarding information related to children and young people.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Can I use EdPsych Connect on mobile devices?</h3>
              <p className="text-muted-foreground">
                Absolutely! EdPsych Connect is fully responsive and works seamlessly across desktops, tablets, and mobile phones, ensuring you can access your educational resources wherever you are.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
