"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown } from "lucide-react"

interface TimePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onTimeChange: (time: string) => void;
}


export function TimePicker({ value, onTimeChange, className, ...props }: TimePickerProps) {
  const [hours, setHours] = React.useState(12)
  const [minutes, setMinutes] = React.useState(0)
  const [period, setPeriod] = React.useState<"AM" | "PM">("AM")

  React.useEffect(() => {
    // Parse the initial value string
    const [timePart, periodPart] = value.split(" ")
    if (timePart && periodPart) {
      let [h, m] = timePart.split(":").map(Number)
      if (periodPart === "PM" && h !== 12) {
        h += 12
      } else if (periodPart === "AM" && h === 12) {
        h = 0
      }
      setHours(h)
      setMinutes(m)
      setPeriod(periodPart as "AM" | "PM")
    } else {
      // Default to 12:00 AM if value is empty or invalid
      setHours(0)
      setMinutes(0)
      setPeriod("AM")
    }
  }, [value])

  const formatTime = (h: number, m: number, p: "AM" | "PM") => {
    let displayHours = h
    if (h === 0)
      displayHours = 12 // 00:xx AM is 12:xx AM
    else if (h > 12) displayHours -= 12 // 13:xx is 01:xx PM

    return `${displayHours.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${p}`
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let h = Number.parseInt(e.target.value, 10)
    if (isNaN(h)) h = 0
    h = Math.max(0, Math.min(23, h)) // Keep hours within 0-23 range
    setHours(h)
    onTimeChange(formatTime(h, minutes, period))
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let m = Number.parseInt(e.target.value, 10)
    if (isNaN(m)) m = 0
    m = Math.max(0, Math.min(59, m)) // Keep minutes within 0-59 range
    setMinutes(m)
   onTimeChange(formatTime(hours, m, period))
  }

  const handlePeriodToggle = () => {
    const newPeriod = period === "AM" ? "PM" : "AM"
    setPeriod(newPeriod)
    onTimeChange(formatTime(hours, minutes, newPeriod))
  }

  const incrementHours = () => {
    const newHours = (hours + 1) % 24
    setHours(newHours)
    const newPeriod = newHours >= 12 ? "PM" : "AM"
    setPeriod(newPeriod)
    onTimeChange(formatTime(newHours, minutes, newPeriod))
  }

  const decrementHours = () => {
    const newHours = (hours - 1 + 24) % 24
    setHours(newHours)
    const newPeriod = newHours >= 12 ? "PM" : "AM"
    setPeriod(newPeriod)
    onTimeChange(formatTime(newHours, minutes, newPeriod))
  }

  const incrementMinutes = () => {
    const newMinutes = (minutes + 1) % 60
    setMinutes(newMinutes)
   onTimeChange(formatTime(hours, newMinutes, period))
  }

  const decrementMinutes = () => {
    const newMinutes = (minutes - 1 + 60) % 60
    setMinutes(newMinutes)
   onTimeChange(formatTime(hours, newMinutes, period))
  }

  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours

  return (
    <div className={cn("flex items-center justify-center gap-2 p-4", className)} {...props}>
      <div className="flex flex-col items-center">
        <Button variant="ghost" size="icon" onClick={incrementHours}>
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={displayHours.toString().padStart(2, "0")}
          onChange={handleHoursChange}
          className="w-16 text-center text-lg font-medium border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          min={1}
          max={12}
        />
        <Button variant="ghost" size="icon" onClick={decrementHours}>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <span className="text-lg font-medium">:</span>
      <div className="flex flex-col items-center">
        <Button variant="ghost" size="icon" onClick={incrementMinutes}>
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={minutes.toString().padStart(2, "0")}
          onChange={handleMinutesChange}
          className="w-16 text-center text-lg font-medium border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          min={0}
          max={59}
        />
        <Button variant="ghost" size="icon" onClick={decrementMinutes}>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <Button variant="ghost" size="icon" onClick={handlePeriodToggle}>
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="w-16 text-center text-lg font-medium border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          onClick={handlePeriodToggle}
        >
          {period}
        </Button>
        <Button variant="ghost" size="icon" onClick={handlePeriodToggle}>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
