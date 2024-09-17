'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Component() {
  const [baseSalary, setBaseSalary] = useState(100000)
  const [overtimeHours, setOvertimeHours] = useState(10) // Configurable overtime hours
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(1.5) // Overtime multiplier (1.5x, 2x, etc.)
  const [calculatedTax, setCalculatedTax] = useState<number | null>(null)
  const [hourlyRate, setHourlyRate] = useState<number | null>(null)
  const [adjustedPayRate, setAdjustedPayRate] = useState<number | null>(null)
  const [taxSavings, setTaxSavings] = useState<number | null>(null)

  const calculateFederalTax = (income: number) => {
    // Simplified federal tax brackets for illustration purposes
    if (income <= 10000) return income * 0.10
    if (income <= 40000) return 1000 + (income - 10000) * 0.12
    if (income <= 85000) return 4600 + (income - 40000) * 0.22
    return 14500 + (income - 85000) * 0.24
  }

  const calculateHourlyRate = (salary: number) => {
    const weeksPerYear = 52
    const hoursPerWeek = 40
    return salary / (weeksPerYear * hoursPerWeek)
  }

  const calculateAdjustedPayRate = (salary: number, overtimeHours: number, overtimeMultiplier: number) => {
    const weeksPerYear = 52
    const regularHoursPerWeek = 40
    const totalOvertimePayRate = overtimeHours * overtimeMultiplier
    const totalHoursPerWeek = regularHoursPerWeek + totalOvertimePayRate

    return salary / (weeksPerYear * totalHoursPerWeek)
  }

  const handleCalculate = () => {
    const hourlyRate = calculateHourlyRate(baseSalary)
    const adjustedRate = calculateAdjustedPayRate(baseSalary, overtimeHours, overtimeMultiplier)

    // Calculate the total annual pay with overtime (including the overtime multiplier)
    const weeksPerYear = 52
    const overtimePay = overtimeHours * adjustedRate * overtimeMultiplier * weeksPerYear
    const totalIncomeWithOvertime = baseSalary + overtimePay

    // Calculate the tax on the total income with overtime
    const federalTax = calculateFederalTax(baseSalary)
    const taxWithOvertime = calculateFederalTax(totalIncomeWithOvertime)

    // The difference between total tax with overtime and without overtime
    const taxOnOvertime = taxWithOvertime - federalTax

    setCalculatedTax(federalTax)
    setHourlyRate(hourlyRate)
    setAdjustedPayRate(adjustedRate)
    setTaxSavings(taxOnOvertime)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Federal Tax and Pay Rate Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="baseSalary">Base Salary ($)</Label>
            <Input
              id="baseSalary"
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="overtimeHours">Overtime Hours Per Week</Label>
            <Input
              id="overtimeHours"
              type="number"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(Number(e.target.value))} 
            />
          </div>
          <div>
            <Label htmlFor="overtimeMultiplier">Overtime Pay Multiplier (e.g., 1.5x, 2x, 3x)</Label>
            <Input
              id="overtimeMultiplier"
              type="number"
              step="0.1"
              value={overtimeMultiplier}
              onChange={(e) => setOvertimeMultiplier(Number(e.target.value))}
            />
          </div>
          <Button onClick={handleCalculate} className="w-full">Calculate</Button>
          {calculatedTax !== null && hourlyRate !== null && (
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold">Results:</h3>
              <p>Base Salary: ${baseSalary.toFixed(2)}</p>
              <p>Hourly Rate (Based on 40-hour week): ${hourlyRate.toFixed(2)}</p>
              <p>Estimated Federal Tax: ${calculatedTax.toFixed(2)}</p>
              <p>Net Income After Tax: ${(baseSalary - calculatedTax).toFixed(2)}</p>
            </div>
          )}

          {adjustedPayRate !== null && taxSavings !== null && hourlyRate !== null && (
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold">Overtime Results:</h3>
              <p>Adjusted Pay Rate (with {overtimeHours} hours of overtime): ${adjustedPayRate.toFixed(2)}</p>
              <p>Total Overtime Pay (with {overtimeMultiplier}x rate): ${(overtimeHours * adjustedPayRate * overtimeMultiplier * 52).toFixed(2)}</p>
              <p>Tax Paid on Overtime (Tax Savings): ${taxSavings.toFixed(2)}</p>
            </div>
          )}

          {adjustedPayRate !== null && taxSavings !== null && calculatedTax !== null && (
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold">Difference in take-home pay:</h3>
              <p>New take-home pay after {overtimeHours} hours of fabricated overtime at pay rate of {adjustedPayRate.toFixed(2)}: ${((baseSalary - calculatedTax) + taxSavings).toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
