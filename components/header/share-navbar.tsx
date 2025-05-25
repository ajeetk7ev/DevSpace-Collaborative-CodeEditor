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
import { Loader2 } from "lucide-react";


type NavbarProps = {
    languages: string[];
    curLanguage: string;
    loading:boolean;
    setCurLanguage: (lang: string) => void;
    onRunCode: () => void;
};

export function ShareNavbar({ languages, setCurLanguage, curLanguage, onRunCode, loading }: NavbarProps) {
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
        </div>
      </div>
    </header>
    );
}
