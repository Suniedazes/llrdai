import {ContactInquiry} from '@/components/ContactInquiry';
import {company} from '@/content/company';
import {pageMetadata} from '@/lib/seo';
import Link from 'next/link';
import '../contact/contact.css';
export const metadata=pageMetadata('Privacy Request Center','Your privacy choices and appeals, where applicable.','/privacy-requests');
export default function PrivacyRequests(){return <div className="container contact-page"><section className="page-intro"><p className="eyebrow">LLRD / YOUR PRIVACY CHOICES</p><h1>Privacy Request Center</h1><p className="lead">Request access, correction, deletion or other privacy assistance where applicable.</p><p>Rights depend on your jurisdiction and the law’s applicability. Selecting a category does not mean every right applies to every person.</p><p>All requests and appeals go to <a href={'mailto:'+company.businessEmail}>{company.businessEmail}</a>. For an appeal, select Privacy Appeal and identify the earlier request in your message. Do not include identity documents or sensitive records. We may need to verify identity through an appropriate follow-up process.</p><p>Online submission is not yet connected. You may email the address above; no request is recorded by preparing this form.</p><Link href="/privacy">Read the Privacy Policy</Link></section><ContactInquiry privacy/></div>;}
