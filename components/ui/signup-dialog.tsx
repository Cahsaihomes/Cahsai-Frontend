"use client";

import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginDialog } from "@/components/ui/login-dialog" 


interface SignupDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export function SignupDialog({ isOpen, setIsOpen }: SignupDialogProps) {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  const handleLoginClick = () => {
    setIsOpen(false) // Close the SignupDialog
    setIsLoginDialogOpen(true) // Open the LoginDialog
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md rounded-lg p-6">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-gray-900">Unlock the Full Story</DialogTitle>
            <DialogDescription className="text-base text-gray-600 mt-2">
              Sign up to feel the vibe, see the story, love the space.
            </DialogDescription>
          </DialogHeader>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center gap-2 mt-6">
          {" "}
          {/* Adjusted gap to gap-2 for a slightly smaller space */}
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 flex items-center justify-center bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 rounded-md px-5 py-2.5" // Adjusted px-6 to px-5 and py-3 to py-2.5 for slightly smaller buttons
          >
            Cancel
          </Button>
      
      <Link
  href="/signup"
  className="flex-1 flex items-center justify-center bg-[#E53E3E] text-white hover:bg-[#E53E3E]/90 rounded-md px-5 py-2.5"
>
  Sign Up to View
</Link>

        </DialogFooter>
         <div className="text-center text-sm mt-6">
            Already have an account?{" "}
            <span
              onClick={handleLoginClick}
              className="font-semibold text-gray-800 hover:underline cursor-pointer" // Changed to span with onClick
            >
              Log in
            </span>
          </div>
        </DialogContent>
      </Dialog>

      {/* Render the LoginDialog conditionally */}
      <LoginDialog isOpen={isLoginDialogOpen} setIsOpen={setIsLoginDialogOpen} />
    </>
  )
}
