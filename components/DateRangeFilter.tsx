'use client'

import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar, X, Clock } from 'lucide-react'

interface DateRangeFilterProps {
  startDate: Date | null
  endDate: Date | null
  onStartDateChange: (date: Date | null) => void
  onEndDateChange: (date: Date | null) => void
  onClear: () => void
  resultsCount?: number
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  resultsCount,
}: DateRangeFilterProps) {
  const hasFilters = startDate || endDate

  // Atalhos rápidos
  const setToday = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)
    onStartDateChange(today)
    onEndDateChange(todayEnd)
  }

  const setYesterday = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    const yesterdayEnd = new Date(yesterday)
    yesterdayEnd.setHours(23, 59, 59, 999)
    onStartDateChange(yesterday)
    onEndDateChange(yesterdayEnd)
  }

  const setLastWeek = () => {
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    const start = new Date()
    start.setDate(start.getDate() - 7)
    start.setHours(0, 0, 0, 0)
    onStartDateChange(start)
    onEndDateChange(end)
  }

  const setLastMonth = () => {
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    const start = new Date()
    start.setDate(start.getDate() - 30)
    start.setHours(0, 0, 0, 0)
    onStartDateChange(start)
    onEndDateChange(end)
  }

  const setThisMonth = () => {
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    const start = new Date(end.getFullYear(), end.getMonth(), 1)
    start.setHours(0, 0, 0, 0)
    onStartDateChange(start)
    onEndDateChange(end)
  }

  return (
    <div className="card bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Filtrar por Período</h3>
            {resultsCount !== undefined && (
              <p className="text-xs text-gray-500">
                {resultsCount} {resultsCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            )}
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={onClear}
            className="btn-ghost btn-sm w-full sm:w-auto"
          >
            <X className="w-4 h-4" />
            Limpar
          </button>
        )}
      </div>

      {/* Atalhos Rápidos */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Atalhos Rápidos
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={setToday}
            className="btn-outline btn-sm text-xs"
          >
            Hoje
          </button>
          <button
            onClick={setYesterday}
            className="btn-outline btn-sm text-xs"
          >
            Ontem
          </button>
          <button
            onClick={setLastWeek}
            className="btn-outline btn-sm text-xs"
          >
            Últimos 7 dias
          </button>
          <button
            onClick={setThisMonth}
            className="btn-outline btn-sm text-xs"
          >
            Este mês
          </button>
          <button
            onClick={setLastMonth}
            className="btn-outline btn-sm text-xs"
          >
            Últimos 30 dias
          </button>
        </div>
      </div>

      {/* Seletores de Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Data Inicial */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Inicial
          </label>
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={onStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={endDate || new Date()}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/aaaa"
              className="input-field w-full pl-10"
              calendarClassName="custom-datepicker"
              locale="pt-BR"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Data Final */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Final
          </label>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={onEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={new Date()}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/aaaa"
              className="input-field w-full pl-10"
              calendarClassName="custom-datepicker"
              locale="pt-BR"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Período Selecionado */}
      {hasFilters && (
        <div className="mt-4 p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-700 mb-0.5">Período selecionado:</p>
              <p className="text-sm font-semibold text-gray-900">
                {startDate ? startDate.toLocaleDateString('pt-BR') : '...'} 
                {' '}<span className="text-gray-400">até</span>{' '}
                {endDate ? endDate.toLocaleDateString('pt-BR') : '...'}
              </p>
              {resultsCount !== undefined && resultsCount === 0 && (
                <p className="text-xs text-warning-dark mt-1">
                  ⚠️ Nenhum registro encontrado neste período
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
