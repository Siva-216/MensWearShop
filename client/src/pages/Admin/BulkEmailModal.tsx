import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  Mail, 
  Calendar, 
  Tag, 
  Eye, 
  Megaphone,
  AlertTriangle,
  Info,
  AlertOctagon,
  Image as ImageIcon
} from 'lucide-react';

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

interface BulkEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { role: string, subject: string, message: string, isHtml?: boolean }) => void;
}

// ==========================================
// Email Templates Generation Functions (Inline Styled HTML)
// ==========================================

const generatePlainEmailHtml = (subject: string, message: string) => {
  const formattedMessage = message.replace(/\n/g, '<br/>');
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
        .wrapper { width: 100%; background-color: #f8fafc; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { text-align: center; background-color: #0f172a; padding: 30px 20px; }
        .logo { font-size: 24px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: #ffffff; margin: 0; }
        .tagline { font-size: 10px; color: #94a3b8; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 5px; }
        .content { padding: 40px; font-size: 15px; line-height: 1.6; color: #334155; }
        .footer { text-align: center; background-color: #f1f5f9; padding: 25px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .footer a { color: #0f172a; text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <div class="logo">FASHION WORLD</div>
            <div class="tagline">Elevated Style & Craftsmanship</div>
          </div>
          <div class="content">
            ${formattedMessage || '<em style="color:#94a3b8">Write your email content in the editor...</em>'}
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Fashion World. All rights reserved.<br>
            If you have any questions, visit our <a href="${FRONTEND_URL}/contact" target="_blank">Support Center</a>.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateOfferEmailHtml = (params: {
  subject: string,
  offerTitle: string,
  offerDescription: string,
  productName: string,
  originalPrice: string,
  offerPrice: string,
  productImageUrl: string,
  productUrl: string,
  buttonText: string
}) => {
  const { subject, offerTitle, offerDescription, productName, originalPrice, offerPrice, productImageUrl, productUrl, buttonText } = params;
  const imageUrl = productImageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=60';
  const originalPriceHtml = originalPrice ? `<span style="text-decoration: line-through; color: #94a3b8; font-size: 18px; margin-right: 10px;">&#x20B9;${originalPrice}</span>` : '';
  const descHtml = offerDescription ? offerDescription.replace(/\n/g, '<br/>') : 'Exclusive promotion details...';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
        .wrapper { width: 100%; background-color: #f8fafc; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
        .header { text-align: center; background-color: #0f172a; padding: 30px 20px; }
        .logo { font-size: 24px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: #ffffff; margin: 0; }
        .tagline { font-size: 10px; color: #94a3b8; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 5px; }
        
        .hero-banner { background-color: #fef2f2; border-bottom: 1px solid #fee2e2; padding: 30px; text-align: center; }
        .offer-badge { background-color: #dc2626; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 14px; display: inline-block; border-radius: 9999px; margin-bottom: 12px; }
        .offer-title { font-size: 26px; font-weight: 800; color: #991b1b; margin: 0 0 10px 0; line-height: 1.2; }
        .offer-desc { font-size: 14px; color: #7f1d1d; margin: 0; line-height: 1.5; }
        
        .product-card { padding: 35px; text-align: center; }
        .product-image { max-width: 100%; height: auto; max-height: 280px; object-fit: cover; border-radius: 8px; border: 1px solid #f1f5f9; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .product-title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; }
        
        .price-block { margin: 15px 0 25px 0; }
        .current-price { color: #dc2626; font-size: 24px; font-weight: 800; }
        
        .cta-btn { background-color: #0f172a; color: #ffffff !important; text-decoration: none; padding: 12px 32px; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 6px; display: inline-block; }
        
        .footer { text-align: center; background-color: #f1f5f9; padding: 25px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .footer a { color: #0f172a; text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <div class="logo">FASHION WORLD</div>
            <div class="tagline">Elevated Style & Craftsmanship</div>
          </div>
          
          <div class="hero-banner">
            <div class="offer-badge">Exclusive Offer</div>
            <h1 class="offer-title">${offerTitle || 'Limited Time Discount'}</h1>
            <p class="offer-desc">${descHtml}</p>
          </div>
          
          <div class="product-card">
            <img class="product-image" src="${imageUrl}" alt="${productName}" />
            <h2 class="product-title">${productName}</h2>
            <div class="price-block">
              ${originalPriceHtml}
              <span class="current-price">&#x20B9;${offerPrice || '0.00'}</span>
            </div>
            <a href="${productUrl}" class="cta-btn" target="_blank">${buttonText || 'Shop Now'}</a>
          </div>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} Fashion World. All rights reserved.<br>
            Want to see more styles? Shop our full catalog <a href="${FRONTEND_URL}" target="_blank">here</a>.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateHolidayEmailHtml = (params: {
  subject: string,
  noticeTitle: string,
  noticeDate: string,
  noticeContent: string,
  urgency: string
}) => {
  const { subject, noticeTitle, noticeDate, noticeContent, urgency } = params;
  
  let urgencyBadgeColor = '#e2e8f0';
  let urgencyTextColor = '#475569';
  let urgencyBorderColor = '#cbd5e1';
  
  if (urgency === 'important') {
    urgencyBadgeColor = '#fffbeb';
    urgencyTextColor = '#b45309';
    urgencyBorderColor = '#fde68a';
  } else if (urgency === 'critical') {
    urgencyBadgeColor = '#fef2f2';
    urgencyTextColor = '#b91c1c';
    urgencyBorderColor = '#fca5a5';
  }
  
  const contentHtml = noticeContent ? noticeContent.replace(/\n/g, '<br/>') : 'Details of announcement...';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
        .wrapper { width: 100%; background-color: #f8fafc; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
        .header { text-align: center; background-color: #1e293b; padding: 25px 20px; }
        .logo { font-size: 20px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #ffffff; margin: 0; }
        .tagline { font-size: 9px; color: #94a3b8; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 5px; }
        
        .notice-banner { background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 30px; text-align: center; }
        .notice-header { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 10px; }
        .notice-title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 15px 0; line-height: 1.3; }
        
        .urgency-badge { font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; padding: 5px 12px; display: inline-block; border-radius: 4px; border: 1px solid ${urgencyBorderColor}; background-color: ${urgencyBadgeColor}; color: ${urgencyTextColor}; margin-bottom: 10px; }
        .notice-date { font-size: 13px; color: #64748b; font-weight: 600; }
        
        .content { padding: 35px 40px; font-size: 15px; line-height: 1.6; color: #334155; }
        .info-box { background-color: #f1f5f9; border-left: 4px solid #475569; padding: 15px 20px; margin-top: 25px; border-radius: 0 6px 6px 0; font-size: 13px; color: #475569; }
        
        .footer { text-align: center; background-color: #f8fafc; padding: 25px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <div class="logo">FASHION WORLD</div>
            <div class="tagline">Staff Internal Communication</div>
          </div>
          
          <div class="notice-banner">
            <div class="notice-header">Internal Store Communication</div>
            <h1 class="notice-title">${noticeTitle || 'Staff Notice'}</h1>
            <div class="urgency-badge">${urgency} Urgency</div>
            <div class="notice-date">Effective Date: ${noticeDate || 'Immediately'}</div>
          </div>
          
          <div class="content">
            ${contentHtml}
            
            <div class="info-box">
              <strong>Notice to Staff:</strong> This is a broadcast store announcement. Please coordinate with managers if you require duty/shift adjustments or have any queries.
            </div>
          </div>
          
          <div class="footer">
            Confidential: Meant strictly for internal distribution within Fashion World.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// Main Modal Component
// ==========================================

export const BulkEmailModal: React.FC<BulkEmailModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      role: 'all',
      templateType: 'plain',
      subject: '',
      message: '',
      // Product promo
      productId: '',
      offerTitle: '',
      offerDescription: '',
      originalPrice: '',
      offerPrice: '',
      buttonText: 'Shop Now',
      // Staff holiday
      noticeTitle: '',
      noticeDate: new Date().toISOString().split('T')[0],
      noticeContent: '',
      urgency: 'info',
    }
  });

  const templateType = watch('templateType');
  const role = watch('role');
  const subject = watch('subject');
  const message = watch('message');
  const productId = watch('productId');
  const offerTitle = watch('offerTitle');
  const offerDescription = watch('offerDescription');
  const originalPrice = watch('originalPrice');
  const offerPrice = watch('offerPrice');
  const buttonText = watch('buttonText');
  const noticeTitle = watch('noticeTitle');
  const noticeDate = watch('noticeDate');
  const noticeContent = watch('noticeContent');
  const urgency = watch('urgency');

  // Load products list from db
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.products.getAll(),
    enabled: isOpen
  });

  const selectedProduct = React.useMemo(() => {
    return products?.find((p: any) => p.id === productId);
  }, [products, productId]);

  // Handle product select auto-fill logic
  React.useEffect(() => {
    if (selectedProduct) {
      const originalPriceVal = selectedProduct.price || 0;
      // Default suggested 20% discount
      const offerPriceVal = Math.round(originalPriceVal * 0.8);
      
      setValue('originalPrice', originalPriceVal.toString());
      setValue('offerPrice', offerPriceVal.toString());
      setValue('offerTitle', `Special Offer: 20% OFF ${selectedProduct.name}!`);
      setValue('offerDescription', selectedProduct.description || `For a limited time, get our premium ${selectedProduct.name} at a special discounted price. Enjoy fast delivery and simple checkout!`);
      setValue('subject', `Exclusive Deal: Save big on ${selectedProduct.name}!`);
    }
  }, [productId, selectedProduct, setValue]);

  // Handle staff holiday select auto-fill template fields
  React.useEffect(() => {
    if (templateType === 'holiday') {
      setValue('subject', 'Store Notice: Holiday Declaration');
      setValue('noticeTitle', 'Upcoming Staff Holiday Announcement');
      setValue('noticeContent', 'Please take note that the showroom will be closed/operating under reduced hours for the upcoming public holiday. \n\nAll monthly contract and regular staff shifts will be rescheduled accordingly. For any urgent concerns, contact the floor administrator.');
      setValue('urgency', 'important');
      setValue('role', 'staff'); // Lock audience to staff automatically
    } else if (templateType === 'plain') {
      setValue('subject', 'Fashion World Announcement');
    }
  }, [templateType, setValue]);

  // Live visual preview generation
  const previewHtml = React.useMemo(() => {
    if (templateType === 'offer') {
      const productImageUrl = selectedProduct?.imageUrl || '';
      const productUrl = productId ? `${FRONTEND_URL}/products/${productId}` : FRONTEND_URL;
      
      return generateOfferEmailHtml({
        subject: subject || 'Special Offer Alert!',
        offerTitle: offerTitle || 'SPECIAL PROMOTION',
        offerDescription: offerDescription || 'We are running an exclusive sale for our registered members.',
        productName: selectedProduct?.name || 'Select Product',
        originalPrice,
        offerPrice: offerPrice || '0.00',
        productImageUrl,
        productUrl,
        buttonText: buttonText || 'Shop Now'
      });
    } else if (templateType === 'holiday') {
      return generateHolidayEmailHtml({
        subject: subject || 'Store Notice to Staff',
        noticeTitle: noticeTitle || 'Holiday / Internal Announcement',
        noticeDate: noticeDate || new Date().toISOString().split('T')[0],
        noticeContent: noticeContent || 'Details of the announcement...',
        urgency: urgency || 'info'
      });
    } else {
      return generatePlainEmailHtml(
        subject || 'Important Announcement',
        message || ''
      );
    }
  }, [templateType, subject, message, selectedProduct, originalPrice, offerPrice, offerTitle, offerDescription, buttonText, noticeTitle, noticeDate, noticeContent, urgency, productId]);

  const onFormSubmit = (data: any) => {
    if (!data.subject) {
      toast({ title: "Subject Required", description: "Please enter an email subject line.", variant: "destructive" });
      return;
    }

    if (data.templateType === 'plain' && !data.message) {
      toast({ title: "Message Content Required", description: "Please enter announcement text.", variant: "destructive" });
      return;
    }

    if (data.templateType === 'offer' && !data.productId) {
      toast({ title: "Product Required", description: "Please select a product for the promotion.", variant: "destructive" });
      return;
    }

    // Compile dynamic HTML based on selected template
    let compiledMessage = previewHtml;
    
    onSubmit({
      role: data.role,
      subject: data.subject,
      message: compiledMessage,
      isHtml: true
    });
    
    reset();
  };

  const handleTemplateSelect = (type: 'plain' | 'offer' | 'holiday') => {
    setValue('templateType', type);
  };

  const onOpenChangeHandler = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden rounded-xl border border-muted/50 shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b bg-card">
          <DialogTitle className="flex items-center gap-2 text-xl font-display font-bold">
            <Mail className="text-primary h-5 w-5" />
            Email Broadcast Studio
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="flex-1 flex overflow-hidden">
          {/* LEFT COLUMN: Controls & Fields */}
          <div className="w-1/2 flex flex-col border-r border-muted/30 h-full">
            <ScrollArea className="flex-1 px-6 py-5">
              <div className="space-y-6 pr-3 pb-8">
                
                {/* Section 1: Template Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Select Design Template
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleTemplateSelect('plain')}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 text-left transition-all ${
                        templateType === 'plain'
                          ? 'border-primary bg-primary/5 text-primary shadow-sm'
                          : 'border-muted bg-card hover:bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      <Megaphone className="h-5 w-5 mb-2" />
                      <span className="font-bold text-xs">Announcement</span>
                      <span className="text-[10px] opacity-80 mt-0.5">Plain text / HTML</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTemplateSelect('offer')}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 text-left transition-all ${
                        templateType === 'offer'
                          ? 'border-primary bg-primary/5 text-primary shadow-sm'
                          : 'border-muted bg-card hover:bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      <Tag className="h-5 w-5 mb-2" />
                      <span className="font-bold text-xs">Product Offer</span>
                      <span className="text-[10px] opacity-80 mt-0.5">Promotional offer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTemplateSelect('holiday')}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 text-left transition-all ${
                        templateType === 'holiday'
                          ? 'border-primary bg-primary/5 text-primary shadow-sm'
                          : 'border-muted bg-card hover:bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      <Calendar className="h-5 w-5 mb-2" />
                      <span className="font-bold text-xs">Staff Announcement</span>
                      <span className="text-[10px] opacity-80 mt-0.5">Internal / Holiday</span>
                    </button>
                  </div>
                </div>

                {/* Section 2: Recipient Audience */}
                <div className="space-y-3 p-4 bg-muted/30 rounded-xl">
                  <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Recipient Audience</Label>
                  <RadioGroup 
                    value={role} 
                    onValueChange={(val) => setValue('role', val)}
                    className="flex items-center gap-4 pt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="aud1" />
                      <Label htmlFor="aud1" className="cursor-pointer text-sm font-medium">All Users</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="user" id="aud2" />
                      <Label htmlFor="aud2" className="cursor-pointer text-sm font-medium">Customers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="staff" id="aud3" />
                      <Label htmlFor="aud3" className="cursor-pointer text-sm font-medium">Staff Only</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Section 3: Subject (Always Visible) */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-semibold">Email Subject Line</Label>
                  <Input 
                    id="subject" 
                    {...register('subject', { required: true })} 
                    placeholder="Enter email subject header..." 
                    className="h-10 rounded-lg focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                {/* Section 4: Dynamic Template Specific Fields */}
                {templateType === 'plain' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Label htmlFor="message" className="text-sm font-semibold">Message Body Content</Label>
                    <Textarea 
                      id="message" 
                      {...register('message')} 
                      placeholder="Write your announcement details here. You can use line breaks..." 
                      className="min-h-[220px] rounded-lg focus-visible:ring-1 focus-visible:ring-primary font-sans leading-relaxed"
                    />
                  </div>
                )}

                {templateType === 'offer' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-2">
                      <Label htmlFor="productId" className="text-sm font-semibold">Select Promoted Product</Label>
                      <Select 
                        value={productId} 
                        onValueChange={(val) => setValue('productId', val)}
                      >
                        <SelectTrigger className="h-11 rounded-lg">
                          <SelectValue placeholder="Search or select a product..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {products && products.length > 0 ? (
                            products.map((p: any) => (
                              <SelectItem key={p.id} value={p.id}>
                                <div className="flex items-center gap-3 py-1">
                                  {p.imageUrl ? (
                                    <img src={p.imageUrl} alt={p.name} className="w-8 h-8 rounded object-cover" />
                                  ) : (
                                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center"><ImageIcon size={14} className="text-muted-foreground" /></div>
                                  )}
                                  <div className="flex flex-col text-left">
                                    <span className="font-semibold text-xs text-foreground line-clamp-1">{p.name}</span>
                                    <span className="text-[10px] text-muted-foreground">&#x20B9;{p.price} &middot; {p.category}</span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No products available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="offerTitle" className="text-sm font-semibold">Offer Banner Title</Label>
                      <Input 
                        id="offerTitle" 
                        {...register('offerTitle')} 
                        placeholder="e.g. Exclusive Deal: 20% OFF!" 
                        className="h-10 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="offerDescription" className="text-sm font-semibold">Offer Description Details</Label>
                      <Textarea 
                        id="offerDescription" 
                        {...register('offerDescription')} 
                        placeholder="Explain the offer limits, seasonal context..." 
                        className="min-h-[90px] rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice" className="text-sm font-semibold">Original Price (&#x20B9;)</Label>
                        <Input 
                          id="originalPrice" 
                          {...register('originalPrice')} 
                          placeholder="e.g. 1999" 
                          className="h-10 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="offerPrice" className="text-sm font-semibold">Promo Offer Price (&#x20B9;)</Label>
                        <Input 
                          id="offerPrice" 
                          {...register('offerPrice')} 
                          placeholder="e.g. 1499" 
                          className="h-10 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buttonText" className="text-sm font-semibold">Call to Action Button Text</Label>
                      <Input 
                        id="buttonText" 
                        {...register('buttonText')} 
                        placeholder="e.g. Shop Collection Now" 
                        className="h-10 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {templateType === 'holiday' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="noticeTitle" className="text-sm font-semibold">Notice Header Title</Label>
                        <Input 
                          id="noticeTitle" 
                          {...register('noticeTitle')} 
                          placeholder="e.g. Easter Holiday Closure" 
                          className="h-10 rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="noticeDate" className="text-sm font-semibold">Effective Date</Label>
                        <Input 
                          id="noticeDate" 
                          type="date"
                          {...register('noticeDate')} 
                          className="h-10 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="urgency" className="text-sm font-semibold">Urgency Importance Level</Label>
                      <Select 
                        value={urgency} 
                        onValueChange={(val) => setValue('urgency', val)}
                      >
                        <SelectTrigger className="h-10 rounded-lg">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">
                            <span className="flex items-center gap-2 text-slate-700">
                              <Info className="h-4 w-4 text-blue-500" />
                              General Information
                            </span>
                          </SelectItem>
                          <SelectItem value="important">
                            <span className="flex items-center gap-2 text-amber-700">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              Important Notice
                            </span>
                          </SelectItem>
                          <SelectItem value="critical">
                            <span className="flex items-center gap-2 text-red-700">
                              <AlertOctagon className="h-4 w-4 text-red-500" />
                              Urgent Action Required
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="noticeContent" className="text-sm font-semibold">Announcement Details</Label>
                      <Textarea 
                        id="noticeContent" 
                        {...register('noticeContent')} 
                        placeholder="Provide details about dates, store hours, shift changes, or guidelines..." 
                        className="min-h-[160px] rounded-lg"
                      />
                    </div>
                  </div>
                )}

              </div>
            </ScrollArea>

            {/* Bottom Actions */}
            <div className="px-6 py-4 border-t bg-muted/10 flex items-center justify-between">
              <Button type="button" variant="outline" className="rounded-lg h-10 px-4" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-lg h-10 px-6 font-semibold shadow-md shadow-primary/20">
                Broadcast Email Campaign
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Visual Preview */}
          <div className="w-1/2 bg-muted/10 h-full flex flex-col p-6 overflow-hidden select-none">
            <div className="flex items-center justify-between pb-3">
              <Label className="text-sm font-bold flex items-center gap-1.5 text-muted-foreground">
                <Eye className="h-4 w-4 text-muted-foreground" />
                Live Email Client Preview
              </Label>
              <div className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md border border-muted/50">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-[10px] text-muted-foreground font-mono ml-2">outlook-web-app.html</span>
              </div>
            </div>

            <div className="flex-1 rounded-xl border border-muted bg-white overflow-hidden shadow-sm flex flex-col">
              {/* Fake Email Headers */}
              <div className="px-4 py-3 bg-muted/20 border-b border-muted/30 text-[11px] text-muted-foreground space-y-1">
                <div><span className="font-semibold text-foreground/70">From:</span> Fashion World Announcements &lt;newsletter@fashionworld.com&gt;</div>
                <div>
                  <span className="font-semibold text-foreground/70">To:</span> {
                    role === 'all' ? 'All Registered Users' : 
                    role === 'user' ? 'All Customers Only' : 
                    'Store Staff Members'
                  }
                </div>
                <div className="truncate"><span className="font-semibold text-foreground/70">Subject:</span> {subject || <span className="italic text-muted-foreground/60">[No Subject Specified]</span>}</div>
              </div>

              {/* Iframe Viewport */}
              <div className="flex-1 bg-slate-100 overflow-hidden relative p-4 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <iframe 
                    srcDoc={previewHtml} 
                    className="w-full h-full border-none"
                    title="Live Email HTML Rendering Viewport"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-3 text-[10px] text-muted-foreground text-center">
              Renders using isolated CSS inline-tables, ensuring high fidelity compatibility across iOS Mail, Gmail, and Outlook.
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
