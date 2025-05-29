'use client';

import { Button } from "../ui/button";
import { FaPlay } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2, Settings, Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { editorThemes, fontSizes } from "@/utils/data";
import { UserProfile } from "./user-profile";
import { SignOutButton } from "@clerk/nextjs";
import { Separator } from "@radix-ui/react-select";

type NavbarProps = {
  languages: string[];
  curLanguage: string;
  loading: boolean;
  setCurLanguage: (lang: string) => void;
  setEditorTheme: (theme: string) => void;
  setFontSize: (size: string) => void;
  onRunCode: () => void;
  editorTheme: string;
  totalUsersInRoom: number;
};

export function ShareNavbar({
  languages,
  setCurLanguage,
  curLanguage,
  onRunCode,
  loading,
  setEditorTheme,
  setFontSize,
  editorTheme,
  totalUsersInRoom,
}: NavbarProps) {
  return (
    <header className="w-full h-[60px] bg-slate-900 flex items-center justify-center border-b-2 border-b-slate-800">
      <div className="w-[90%] mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-xl sm:text-2xl font-semibold text-white">DevSpace</h1>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={onRunCode}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin text-white" size={16} />
            ) : (
              <>
                <FaPlay />
                RUN
              </>
            )}
          </Button>

          {/* Language Selector */}
          <Select value={curLanguage} onValueChange={setCurLanguage}>
            <SelectTrigger className="w-[150px] border text-white border-gray-300 rounded-xl px-3 py-2">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectLabel>Languages</SelectLabel>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Settings Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings size={16} />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Editor Settings</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Editor Theme</p>
                  <Select value={editorTheme} onValueChange={setEditorTheme}>
                    <SelectTrigger className="w-full border text-black">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {editorThemes.map((theme) => (
                          <SelectItem key={theme} value={theme}>
                            {theme}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Font Size</p>
                  <Select onValueChange={setFontSize} defaultValue="14">
                    <SelectTrigger className="w-full border text-black">
                      <SelectValue placeholder="Font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {fontSizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}px
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>



        {/* Mobile Menu (Sheet) */}
        <div className="md:hidden flex items-center gap-2">
          <span className="bg-green-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow">
           {totalUsersInRoom} Online
          </span>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <Menu className="text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-lg">Editor Controls</SheetTitle>

              </SheetHeader>

              <div className="flex flex-col gap-4 mt-6">
                <Button
                  onClick={onRunCode}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin text-white" size={16} />
                  ) : (
                    <>
                      <FaPlay />
                      RUN
                    </>
                  )}
                </Button>

                <Select value={curLanguage} onValueChange={setCurLanguage}>
                  <SelectTrigger className="w-full border text-black">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Editor Theme</p>
                  <Select value={editorTheme} onValueChange={setEditorTheme}>
                    <SelectTrigger className="w-full border text-black">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {editorThemes.map((theme) => (
                          <SelectItem key={theme} value={theme}>
                            {theme}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Font Size</p>
                  <Select onValueChange={setFontSize} defaultValue="14">
                    <SelectTrigger className="w-full border text-black">
                      <SelectValue placeholder="Font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {fontSizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}px
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>



              <SheetFooter className="border-t border-gray-200 mt-4 pt-4">
                <div className="w-full flex justify-center  bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-all duration-200 shadow-sm">
                  <SignOutButton />
                </div>
              </SheetFooter>

            </SheetContent>


          </Sheet>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <span className="bg-green-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow">
            {totalUsersInRoom} Online
          </span>
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
