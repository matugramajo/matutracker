"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Download, Upload, Heart } from "lucide-react"
import { contentTypes, statusOptions } from "@/lib/constants"

interface FiltersBarProps {
  contentTypeFilter: string
  statusFilter: string
  sortBy: string
  onContentTypeChange: (value: string) => void
  onStatusChange: (value: string) => void
  onSortChange: (value: string) => void
  onAddNew: () => void
  onAddRecommendation: () => void
  onExport?: () => void
  onImport?: () => void
}

export function FiltersBar({
  contentTypeFilter,
  statusFilter,
  sortBy,
  onContentTypeChange,
  onStatusChange,
  onSortChange,
  onAddNew,
  onAddRecommendation,
  onExport,
  onImport,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white p-4 rounded-lg border border-pink-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="flex items-center gap-2 text-pink-700">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filtros:</span>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <Select value={contentTypeFilter} onValueChange={onContentTypeChange}>
              <SelectTrigger className="w-full md:w-[180px] focus:ring-pink-500 focus:border-pink-500">
                <SelectValue placeholder="Tipo de contenido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full md:w-[200px] focus:ring-pink-500 focus:border-pink-500">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-full md:w-[180px] focus:ring-pink-500 focus:border-pink-500">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Fecha (más reciente)</SelectItem>
                <SelectItem value="date_asc">Fecha (más antiguo)</SelectItem>
                <SelectItem value="score_desc">Puntaje (mayor)</SelectItem>
                <SelectItem value="score_asc">Puntaje (menor)</SelectItem>
                <SelectItem value="title_asc">Título (A-Z)</SelectItem>
                <SelectItem value="title_desc">Título (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={onAddNew} className="bg-pink-600 hover:bg-pink-700 text-white w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Agregar ítem
          </Button>
          <Button onClick={onAddRecommendation} className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto">
            <Heart className="h-4 w-4 mr-2" />
            Enviar recomendación
          </Button>
        </div>
      </div>

      {/* Export/Import buttons */}
      {(onExport || onImport) && (
        <div className="flex gap-2 justify-end">
          {onExport && (
            <Button
              onClick={onExport}
              variant="outline"
              size="sm"
              className="text-pink-600 border-pink-200 hover:bg-pink-50 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar datos
            </Button>
          )}
          {onImport && (
            <Button
              onClick={onImport}
              variant="outline"
              size="sm"
              className="text-pink-600 border-pink-200 hover:bg-pink-50 bg-transparent"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar datos
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
