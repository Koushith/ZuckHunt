import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { ChromeIcon } from "lucide-react"
import { TopBar } from "../../components/common/topbar.component"
import { ConnectWallet } from "@thirdweb-dev/react"

export const AuthScreen = () => {
  return (
    <>
      <TopBar />
      <div className='flex items-center justify-center mt-10 h-screen'>
        <div className='w-full max-w-sm'>
          <Card className='bg-background'>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-2xl'>Sign in to ZuckHunt</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4'>
              {/* Removed email input section */}
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  {/* Commented out the Or continue with text */}
                </div>
              </div>

              <ConnectWallet />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
