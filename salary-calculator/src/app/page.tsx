import SalaryCalculator from '../components/salary-calculator'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SalaryCalculator />
    </main>
  )
}