"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import Link from "next/link";



export function JoinRoom() {
    const [room, setRoom] = useState("");
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200">
                    Join Room
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl shadow-xl border border-gray-200">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Join a Room</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Enter the details below to join a collaborative session.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">


                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="roomId" className="text-right font-medium">
                            Room
                        </Label>
                        <Input
                            id="roomId"
                            placeholder="e.g., 1234"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            className="col-span-3 border border-gray-300 focus:ring-green-500 focus:border-green-500 rounded-lg"
                        />
                    </div>
                </div>

                {
                    room.length > 0 &&
                    <DialogFooter>
                        <Link href={`/dashboard/${room}`}>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                Join
                            </Button>
                        </Link>
                    </DialogFooter>
                }
            </DialogContent>
        </Dialog>
    )
}