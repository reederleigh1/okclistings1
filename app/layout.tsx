import type { Metadata } from 'next'
   
   export const metadata: Metadata = {
     // ... your existing metadata
     other: {
       'google-adsense-account': 'ca-pub-2318501422393986'
     }
   }
   
   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <html lang="en">
         <head>
           <meta name="google-adsense-account" content="ca-pub-2318501422393986" />
         </head>
         <body>{children}</body>
       </html>
     )
   }