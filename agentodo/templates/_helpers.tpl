{{/*
Expand the name of the chart.
*/}}
{{- define "agentodo.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "agentodo.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "agentodo.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "agentodo.labels" -}}
helm.sh/chart: {{ include "agentodo.chart" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Backend labels
*/}}
{{- define "agentodo.backend.labels" -}}
{{ include "agentodo.labels" . }}
{{ include "agentodo.backend.selectorLabels" . }}
{{- end }}

{{/*
Backend selector labels
*/}}
{{- define "agentodo.backend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "agentodo.name" . }}-backend
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: backend
{{- end }}

{{/*
Frontend labels
*/}}
{{- define "agentodo.frontend.labels" -}}
{{ include "agentodo.labels" . }}
{{ include "agentodo.frontend.selectorLabels" . }}
{{- end }}

{{/*
Frontend selector labels
*/}}
{{- define "agentodo.frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "agentodo.name" . }}-frontend
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: frontend
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "agentodo.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "agentodo.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
