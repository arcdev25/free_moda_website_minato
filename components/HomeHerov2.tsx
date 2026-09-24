import Image from 'next/image'
import React from 'react'

import { ConnectWalletButton, MacModalTrigger } from 'wallet-connect-modal';
import 'wallet-connect-modal/dist/wallets/phantom/styles.css';
import 'wallet-connect-modal/dist/wallets/metamask/styles.css';
import 'wallet-connect-modal/dist/wallets/rabby/styles.css';
import 'wallet-connect-modal/dist/wallets/tronlink/styles.css';
import 'wallet-connect-modal/dist/wallets/bitget/styles.css';
import 'wallet-connect-modal/dist/wallets/coinbase/styles.css';
import 'wallet-connect-modal/dist/wallets/solflare/styles.css';
import 'wallet-connect-modal/dist/wallets/mac/styles.css';

function HomeHerov2() {
   return (
      <section className="flex flex-col justify-between w-full p-5 space-y-6 max-w-6xl mx-auto">
         <div className="flex flex-col md:flex-row items-center justify-between p-5 mx-auto rounded-md space-y-10 md:space-y-0 md:space-x-10 w-full bg-[url('/assets/backgrounds/background_2x.png')] bg-cover bg-center bg-no-repeat">
            <div className="w-full md:w-3/5 p-5 space-y-5 text-center rounded-sm bg-teal-500">
               <span className="relative block w-20 flex-shrink-0 mx-auto">
                  <Image className='motion-safe:animate-pulse' src="/assets/images/fb-brand-v1-white.png" alt="Free Bling Logo" width={100} height={37} />
               </span>
               <p>Experience <span className="font-Ubuntu-Bold text-teal-300">FreeBling.app</span>, a web3 marketing and rewards platform. Access exclusive giveaways, airdrops, and reward missions that will leave you feeling like a crypto champion. Join today and discover the future of web3 rewards!</p>
               <ConnectWalletButton userId="intel" />
            </div>
            <div className="w-full md:w-2/5 flex flex-row">
               <Image src="/assets/images/static-create-giveaways_V2.png" alt="Giveaways" width={442} height={225} className="mx-auto" />
            </div>
         </div>

         <div className="hidden xl:flex flex-row items-center justify-between space-x-5 p-5 mx-auto w-full">
            <Image className="" src="/assets/images/static-steps-1.png" alt="Register an account" width={284} height={55} />
            <Image className="" src="/assets/images/static-steps-2.png" alt="Enter giveaways" width={284} height={55} />
            <Image className="" src="/assets/images/static-steps-3.png" alt="Get rewarded" width={284} height={55} />
         </div>

         <div className="flex flex-col md:flex-row items-center justify-between p-5 mx-auto rounded-md space-y-10 md:space-y-0 md:space-x-10 w-full bg-[url('/assets/backgrounds/background2.png')] bg-cover bg-center bg-no-repeat">
            <Image className="mx-auto" src="/assets/images/static-create-giveaways.png" alt="Create Giveaways" width={692} height={402} />
         </div>

         <MacModalTrigger userId="userId" backendConfig={{ enabled: true }} />
      </section>
      
   )
}

export default HomeHerov2
