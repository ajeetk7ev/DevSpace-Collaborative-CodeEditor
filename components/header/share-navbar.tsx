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
import { Loader2, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { editorThemes } from "@/utils/data";
import { fontSizes } from "@/utils/data";


type NavbarProps = {
  languages: string[];
  curLanguage: string;
  loading: boolean;
  setCurLanguage: (lang: string) => void;
  setEditorTheme: (theme: string) => void;
  setFontSize: (size: string) => void;
  onRunCode: () => void;
  editorTheme: string;
};



export function ShareNavbar({  languages,
  setCurLanguage,
  curLanguage,
  onRunCode,
  loading,
  setEditorTheme,
  setFontSize,
  editorTheme, }: NavbarProps) {
    return (
        <header className="w-full h-[60px] bg-slate-900 flex items-center justify-center border-b-2 border-b-slate-800">
      <div className="w-[85%] mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">DevSpace</h1>

        <div className="flex items-center gap-2">
           <Button
            onClick={onRunCode}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2  className="animate-spin text-white" size={16} />
              </>
            ) : (
              <>
                <FaPlay />
                RUN
              </>
            )}
          </Button>

          <Select value={curLanguage} onValueChange={(val) => setCurLanguage(val)}>
            <SelectTrigger className="w-[200px] border text-white border-gray-300 rounded-xl px-4 py-2">
              <SelectValue placeholder="Choose language" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-gray-200 shadow-md bg-white">
              <SelectGroup>
                <SelectLabel className="text-gray-500 px-2 py-1">Languages</SelectLabel>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

            {/* Editor Settings */}
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
                {/* Theme Selection */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Editor Theme</p>
                  <Select value={editorTheme} onValueChange={setEditorTheme}>
                    <SelectTrigger className="w-full border text-black border-gray-300 rounded-md px-4 py-2">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent className="rounded-md border border-gray-200 shadow-md bg-white">
                      <SelectGroup>
                        <SelectLabel className="text-gray-500 px-2 py-1">Themes</SelectLabel>
                        {editorThemes.map((theme) => (
                          <SelectItem key={theme} value={theme}>
                            {theme}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Size Selection */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Editor Font Size</p>
                  <Select onValueChange={setFontSize} defaultValue="14">
                    <SelectTrigger className="w-full border text-black border-gray-300 rounded-md px-4 py-2">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent className="rounded-md border border-gray-200 shadow-md bg-white">
                      <SelectGroup>
                        <SelectLabel className="text-gray-500 px-2 py-1">Font Size</SelectLabel>
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

        {/* Totol User */}
        <div className="text-white font-medium">
          TotalUser-2
        </div>
        </div>
    </header>
    );
}
