/**
 * Utility for generating printable HTML profiles for inmates (PPL).
 * Supports single and batch printing with optional watermark.
 */

import { formatDate as formatDateHelper } from '@/core/helpers/formatters';

// ─── Helpers ────────────────────────────────────────────────────────

function formatDate(date: string | null): string {
  if (!date) return 'N/A';
  return formatDateHelper(date, "d 'de' MMMM 'de' yyyy");
}

function calculateAge(birthDate: string | null): string | number {
  if (!birthDate) return 'N/A';
  const today = new Date();
  let birth: Date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate.trim())) {
    const [year, month, day] = birthDate.split('-').map(Number);
    birth = new Date(year, month - 1, day);
  } else {
    birth = new Date(birthDate);
  }
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'ACTIVO',
    transferred: 'EN TRASLADO',
    court_hearing: 'EN AUDIENCIA',
    hospital_external: 'HOSPITAL EXTERNO',
    hospital_internal: 'ENFERMERÍA',
    isolation: 'AISLAMIENTO',
    released: 'LIBERADO',
    deceased: 'FALLECIDO',
    escaped: 'FUGADO',
  };
  return labels[status] || status?.toUpperCase() || 'N/A';
}

function getPrimaryPhotoUrl(inmate: any): string | null {
  if (!inmate?.photos || inmate.photos.length === 0) return null;
  const primaryPhoto = inmate.photos.find((photo: any) => photo.is_current);
  const photo = primaryPhoto || inmate.photos[0];
  return photo.photo_data || photo.photo_url || photo.photo_path || null;
}

const NO_PHOTO_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gRm90bzwvdGV4dD48L3N2Zz4=';

// ─── CSS Styles ─────────────────────────────────────────────────────

function getPrintStyles(watermark?: string): string {
  const watermarkCSS = watermark
    ? `
        .page {
          position: relative;
        }
        .page::after {
          content: '${watermark}';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 80pt;
          font-weight: bold;
          color: rgba(200, 200, 200, 0.25);
          white-space: nowrap;
          pointer-events: none;
          z-index: 0;
          letter-spacing: 10px;
        }
      `
    : '';

  return `
    @page {
      size: letter;
      margin: 1cm;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.3;
    }

    .page {
      page-break-after: always;
      padding: 15px;
    }

    .page:last-child {
      page-break-after: auto;
    }

    /* Header */
    .official-header {
      text-align: center;
      margin-bottom: 15px;
      border-bottom: 3px solid #000;
      padding-bottom: 10px;
    }

    .official-header h1 {
      font-size: 11pt;
      font-weight: bold;
      margin-bottom: 3px;
    }

    .official-header h2 {
      font-size: 10pt;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .official-header .title {
      font-size: 12pt;
      font-weight: bold;
      margin: 5px 0;
    }

    .header-info {
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      margin-top: 5px;
    }

    /* Main container */
    .main-container {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }

    .photo-section {
      flex-shrink: 0;
      width: 150px;
    }

    .photo-section img {
      width: 150px;
      height: 180px;
      object-fit: cover;
      border: 2px solid #333;
    }

    .info-section {
      flex: 1;
    }

    /* Data rows */
    .data-row {
      display: flex;
      margin-bottom: 4px;
      font-size: 9pt;
    }

    .data-row.full {
      flex-direction: column;
    }

    .data-label {
      font-weight: bold;
      min-width: 140px;
      flex-shrink: 0;
    }

    .data-value {
      flex: 1;
    }

    /* Section titles */
    .section-title {
      background-color: #333;
      color: white;
      padding: 5px 10px;
      font-size: 10pt;
      font-weight: bold;
      margin: 15px 0 10px 0;
      text-align: center;
      letter-spacing: 2px;
    }

    /* Fingerprints */
    .fingerprints-container {
      margin: 20px 0;
    }

    .fingerprints-row {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 20px 0;
    }

    .fingerprint-box {
      width: 80px;
      height: 100px;
      border: 2px solid #333;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .fingerprint-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .fingerprint-placeholder {
      color: #ccc;
      font-size: 8pt;
      text-align: center;
    }

    .fingerprints-label {
      text-align: center;
      font-weight: bold;
      margin: 10px 0;
      font-size: 9pt;
    }

    /* Signatures */
    .signatures {
      display: flex;
      justify-content: space-around;
      margin-top: 40px;
      padding-top: 20px;
    }

    .signature-box {
      text-align: center;
      flex: 1;
    }

    .signature-line {
      border-top: 1px solid #333;
      margin-top: 60px;
      padding-top: 5px;
      font-size: 8pt;
      font-weight: bold;
    }

    /* Table styles */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 9pt;
    }

    .data-table td {
      padding: 4px 8px;
      border: 1px solid #ddd;
    }

    .data-table td:first-child {
      font-weight: bold;
      background: #f5f5f5;
      width: 180px;
    }

    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }

    ${watermarkCSS}
  `;
}

// ─── Page Generation ────────────────────────────────────────────────

/**
 * Generates the 2-page HTML content (without <html>/<head> wrappers) for a single inmate.
 */
export function generateInmatePages(inmate: any): string {
  const photoUrl = getPrimaryPhotoUrl(inmate) || NO_PHOTO_PLACEHOLDER;
  const physical = inmate.physical_profile || {};
  const legalProfiles = inmate.legal_profiles || [];
  const primaryLegalProfile = legalProfiles[0] || {};

  const allCrimes = legalProfiles
    .flatMap((profile: any) =>
      profile.crimes?.map((c: any) => c.crime?.name || c.name) || []
    )
    .filter((name: string) => name);

  const emergencyContact =
    inmate.family_members?.find((f: any) => f.is_emergency_contact) ||
    inmate.family_members?.[0] ||
    {};

  const medical = inmate.medical_profile || {};
  const allergies =
    medical.allergies?.map((a: any) => a.allergy_name || a.name).join(', ') || 'Ninguna';
  const chronicDiseases =
    medical.chronic_diseases?.map((d: any) => d.disease_name || d.name).join(', ') || 'Ninguna';

  const securityClass =
    inmate.current_security_classification?.classification?.name || 'No asignada';
  const riskLevel = inmate.risk_classification?.name || 'No asignada';
  const gangInfo = inmate.current_gang_affiliation || null;

  // Fingerprints
  const biometricData = inmate.biometric_data || inmate.biometricData;
  const fingerprintMap: Record<string, string> = {};
  if (biometricData && Array.isArray(biometricData)) {
    biometricData.forEach((bio: any) => {
      const fingerType = bio.finger_type || bio.fingerType;
      const fingerprintImage = bio.fingerprint_image || bio.fingerprintImage;
      if (fingerType && fingerprintImage) {
        fingerprintMap[fingerType] = fingerprintImage.startsWith('data:')
          ? fingerprintImage
          : `data:image/png;base64,${fingerprintImage}`;
      }
    });
  }

  const rightHandFingers = ['right_thumb', 'right_index', 'right_middle', 'right_ring', 'right_pinky'];
  const leftHandFingers = ['left_thumb', 'left_index', 'left_middle', 'left_ring', 'left_pinky'];
  const rightHandPrints = rightHandFingers.map((f) => fingerprintMap[f] || '');
  const leftHandPrints = leftHandFingers.map((f) => fingerprintMap[f] || '');

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-GT');
  const timeStr = now.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
  const centerName = inmate.current_center?.name?.toUpperCase() || 'CENTRO PENITENCIARIO';
  const fullName = inmate.full_name?.toUpperCase() || 'N/A';

  const renderFingerprintBoxes = (prints: string[]) =>
    prints
      .map(
        (print, index) => `
        <div class="fingerprint-box">
          ${print ? `<img src="${print}" alt="Huella ${index + 1}">` : '<div class="fingerprint-placeholder">No capturada</div>'}
        </div>`
      )
      .join('');

  // ── PAGE 1 ──
  const page1 = `
    <div class="page">
      <div class="official-header">
        <h1>${centerName}</h1>
        <h2>MINISTERIO DE GOBERNACI&Oacute;N</h2>
        <div class="title">FICHA DEL INTERNO(A)</div>
        <div class="header-info">
          <span>P&aacute;gina 1 de 2</span>
          <span>Fecha Emisi&oacute;n: ${dateStr} ${timeStr}</span>
          <span>Sistema: GP360</span>
        </div>
      </div>

      <div class="main-container">
        <div class="photo-section">
          <img src="${photoUrl}" alt="Foto del Interno">
        </div>
        <div class="info-section">
          <div class="data-row full" style="margin-bottom: 10px;">
            <span class="data-label">Nombre Completo:</span>
            <span class="data-value" style="font-size: 12pt; font-weight: bold;">${fullName}</span>
          </div>
          <div class="data-row"><span class="data-label">No. Interno:</span><span class="data-value">${inmate.inmate_number || 'N/A'}</span></div>
          <div class="data-row"><span class="data-label">No. Expediente:</span><span class="data-value">${inmate.internal_number || 'N/A'}</span></div>
          <div class="data-row"><span class="data-label">DPI:</span><span class="data-value">${inmate.document_number || 'N/A'}</span></div>
          <div class="data-row"><span class="data-label">Alias/Apodo:</span><span class="data-value">${inmate.alias || 'N/A'}</span></div>
          <div class="data-row"><span class="data-label">Estado:</span><span class="data-value">${getStatusLabel(inmate.status)}</span></div>
          <div class="data-row"><span class="data-label">Centro Actual:</span><span class="data-value">${inmate.current_center?.name || 'N/A'}</span></div>
          <div class="data-row"><span class="data-label">Sector:</span><span class="data-value">${inmate.current_sector?.name || 'N/A'}</span></div>
          <div class="data-row"><span class="data-label">Celda:</span><span class="data-value">${inmate.current_cell?.name || inmate.current_cell_number || 'N/A'}</span></div>
          <div class="data-row"><span class="data-label">Clasificaci&oacute;n Riesgo:</span><span class="data-value">${riskLevel}</span></div>
        </div>
      </div>

      <div class="section-title">DATOS PERSONALES</div>
      <table class="data-table">
        <tr>
          <td>Fecha de Nacimiento:</td><td>${formatDate(inmate.birth_date)}</td>
          <td>Edad:</td><td>${calculateAge(inmate.birth_date)} a&ntilde;os</td>
        </tr>
        <tr>
          <td>G&eacute;nero:</td><td>${inmate.gender === 'M' ? 'MASCULINO' : 'FEMENINO'}</td>
          <td>Estado Civil:</td><td>${inmate.civil_status?.name || 'N/A'}</td>
        </tr>
        <tr>
          <td>Nacionalidad:</td><td>${inmate.nationality?.name || 'GUATEMALTECA'}</td>
          <td>Grupo &Eacute;tnico:</td><td>${inmate.ethnic_group?.name || 'N/A'}</td>
        </tr>
        <tr>
          <td>Lugar de Nacimiento:</td><td>${inmate.birth_municipality?.name || 'N/A'}, ${inmate.birth_department?.name || 'N/A'}</td>
          <td>Idioma Principal:</td><td>${inmate.primary_language?.name || 'Espa&ntilde;ol'}</td>
        </tr>
        <tr><td>Padre:</td><td colspan="3">${inmate.father_name || 'N/A'}</td></tr>
        <tr><td>Madre:</td><td colspan="3">${inmate.mother_name || 'N/A'}</td></tr>
        <tr><td>Direcci&oacute;n Residencia:</td><td colspan="3">${inmate.address || 'N/A'}</td></tr>
        <tr>
          <td>Municipio/Depto.:</td><td>${inmate.municipality?.name || 'N/A'}, ${inmate.department?.name || 'N/A'}</td>
          <td>Tel&eacute;fono:</td><td>${inmate.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td>Ocupaci&oacute;n:</td><td>${inmate.occupation?.name || inmate.occupation_details || 'N/A'}</td>
          <td>Nivel Acad&eacute;mico:</td><td>${inmate.academic_degree?.name || 'N/A'}</td>
        </tr>
        <tr>
          <td>No. de Hijos:</td><td>${inmate.number_of_children || '0'}</td>
          <td>Religi&oacute;n:</td><td>${inmate.religion?.name || 'N/A'}</td>
        </tr>
      </table>

      <div class="section-title">DATOS DE INGRESO</div>
      <table class="data-table">
        <tr>
          <td>Fecha de Admisi&oacute;n:</td><td>${formatDate(inmate.admission_date)}</td>
          <td>Centro de Ingreso:</td><td>${inmate.admission_center?.name || inmate.current_center?.name || 'N/A'}</td>
        </tr>
        <tr>
          <td>Remitido por:</td><td>${inmate.remitting_court?.name || primaryLegalProfile.court?.name || 'N/A'}</td>
          <td>Situaci&oacute;n Jur&iacute;dica:</td><td>${primaryLegalProfile.legal_status?.toUpperCase() || 'PRISI&Oacute;N PREVENTIVA'}</td>
        </tr>
        <tr>
          <td>Delito(s) Principal(es):</td><td colspan="3">${allCrimes.slice(0, 3).join(', ') || 'N/A'}</td>
        </tr>
      </table>

      <div class="section-title">CARACTER&Iacute;STICAS F&Iacute;SICAS</div>
      <table class="data-table">
        <tr><td>Estatura:</td><td>${physical.height ? physical.height + ' m' : 'N/A'}</td><td>Peso:</td><td>${physical.weight ? physical.weight + ' kg' : 'N/A'}</td></tr>
        <tr><td>Tono de Piel:</td><td>${physical.skin_tone?.toUpperCase() || 'N/A'}</td><td>Tipo de Sangre:</td><td>${inmate.blood_type?.name || medical.blood_type?.name || 'N/A'}</td></tr>
        <tr><td>Color de Ojos:</td><td>${physical.eye_color?.toUpperCase() || 'N/A'}</td><td>Forma de Ojos:</td><td>${physical.eye_shape?.toUpperCase() || 'N/A'}</td></tr>
        <tr><td>Tipo de Cabello:</td><td>${physical.hair_type?.toUpperCase() || 'N/A'}</td><td>Color de Cabello:</td><td>${physical.hair_color?.toUpperCase() || 'N/A'}</td></tr>
        <tr><td>Tipo de Nariz:</td><td>${physical.nose_type?.toUpperCase() || 'N/A'}</td><td>Tipo de Boca:</td><td>${physical.mouth_type?.toUpperCase() || 'N/A'}</td></tr>
        <tr><td>Barba:</td><td>${physical.has_beard ? 'S&Iacute;' : 'NO'}</td><td>Bigote:</td><td>${physical.has_mustache ? 'S&Iacute;' : 'NO'}</td></tr>
      </table>

      ${
        physical.tattoos_description || physical.scars_description || physical.birthmarks || physical.other_distinguishing_marks
          ? `
        <div class="section-title">MARCAS DISTINTIVAS</div>
        <table class="data-table">
          ${physical.tattoos_description ? `<tr><td>Tatuajes:</td><td colspan="3">${physical.tattoos_description.toUpperCase()}</td></tr>` : ''}
          ${physical.scars_description ? `<tr><td>Cicatrices:</td><td colspan="3">${physical.scars_description.toUpperCase()}</td></tr>` : ''}
          ${physical.birthmarks ? `<tr><td>Marcas de Nacimiento:</td><td colspan="3">${physical.birthmarks.toUpperCase()}</td></tr>` : ''}
          ${physical.other_distinguishing_marks ? `<tr><td>Otras Marcas:</td><td colspan="3">${physical.other_distinguishing_marks.toUpperCase()}</td></tr>` : ''}
        </table>`
          : ''
      }

      ${
        allergies !== 'Ninguna' || chronicDiseases !== 'Ninguna' || medical.disabilities?.length > 0
          ? `
        <div class="section-title">INFORMACI&Oacute;N M&Eacute;DICA CR&Iacute;TICA</div>
        <table class="data-table">
          <tr><td>Alergias:</td><td colspan="3">${allergies}</td></tr>
          <tr><td>Enfermedades Cr&oacute;nicas:</td><td colspan="3">${chronicDiseases}</td></tr>
          ${medical.disabilities?.length > 0 ? `<tr><td>Discapacidades:</td><td colspan="3">${medical.disabilities.map((d: any) => d.disability_type || d.name).join(', ')}</td></tr>` : ''}
        </table>`
          : ''
      }
    </div>`;

  // ── PAGE 2 ──
  const page2 = `
    <div class="page">
      <div class="official-header">
        <h1>${centerName}</h1>
        <h2>MINISTERIO DE GOBERNACI&Oacute;N</h2>
        <div class="title">FICHA DEL INTERNO(A)</div>
        <div class="header-info">
          <span>P&aacute;gina 2 de 2</span>
          <span>Fecha Emisi&oacute;n: ${dateStr} ${timeStr}</span>
          <span>Sistema: GP360</span>
        </div>
      </div>

      <div class="section-title">INFORMACI&Oacute;N JUR&Iacute;DICA</div>
      <table class="data-table">
        <tr><td>Situaci&oacute;n Jur&iacute;dica:</td><td colspan="3">${primaryLegalProfile.legal_status?.toUpperCase() || 'PRISI&Oacute;N PREVENTIVA'}</td></tr>
        <tr>
          <td>No. Causa Penal:</td><td>${primaryLegalProfile.case_number || 'N/A'}</td>
          <td>No. Expediente Judicial:</td><td>${primaryLegalProfile.judicial_file_number || 'N/A'}</td>
        </tr>
        <tr>
          <td>Fecha de Captura:</td><td>${primaryLegalProfile.arrest_date ? formatDate(primaryLegalProfile.arrest_date) : 'N/A'}</td>
          <td>Fecha de Ingreso:</td><td>${formatDate(inmate.admission_date)}</td>
        </tr>
        <tr><td>Juzgado/Tribunal:</td><td colspan="3">${primaryLegalProfile.court?.name || 'N/A'}</td></tr>
        <tr><td>Delito(s):</td><td colspan="3">${allCrimes.join(', ') || 'N/A'}</td></tr>
        ${
          primaryLegalProfile.sentence_years
            ? `<tr>
                <td>Sentencia:</td><td>${primaryLegalProfile.sentence_years} a&ntilde;os ${primaryLegalProfile.sentence_months || 0} meses</td>
                <td>Fecha Sentencia:</td><td>${primaryLegalProfile.sentence_date ? formatDate(primaryLegalProfile.sentence_date) : 'N/A'}</td>
              </tr>`
            : ''
        }
        ${
          primaryLegalProfile.expected_release_date
            ? `<tr><td>Fecha Estimada Liberaci&oacute;n:</td><td colspan="3">${formatDate(primaryLegalProfile.expected_release_date)}</td></tr>`
            : ''
        }
      </table>

      <div class="section-title">CLASIFICACI&Oacute;N DE SEGURIDAD</div>
      <table class="data-table">
        <tr>
          <td>Clasificaci&oacute;n de Riesgo:</td><td>${riskLevel}</td>
          <td>Nivel de Seguridad:</td><td>${inmate.security_level?.toUpperCase() || 'NO ASIGNADO'}</td>
        </tr>
        <tr><td>Clasificaci&oacute;n de Seguridad:</td><td colspan="3">${securityClass}</td></tr>
        ${
          gangInfo
            ? `<tr><td>Afiliaci&oacute;n a Pandilla:</td><td colspan="3">AFIRMATIVO - ${gangInfo.gang?.name || 'VERIFICAR'}</td></tr>`
            : `<tr><td>Afiliaci&oacute;n a Pandilla:</td><td colspan="3">${inmate.gang_affiliation_status || 'NO REGISTRADA'}</td></tr>`
        }
        ${inmate.requires_special_protection ? `<tr><td>Protecci&oacute;n Especial:</td><td colspan="3">S&Iacute; - ${inmate.protection_reasons || 'Ver notas de seguridad'}</td></tr>` : ''}
        ${inmate.high_profile_case ? `<tr><td>Caso de Alto Perfil:</td><td colspan="3">S&Iacute;</td></tr>` : ''}
      </table>

      <div class="section-title" style="margin-top: 20px;">CONTACTO DE EMERGENCIA</div>
      <table class="data-table">
        <tr><td>Nombre Completo:</td><td colspan="3">${emergencyContact.full_name || inmate.emergency_contact_name || 'N/A'}</td></tr>
        <tr>
          <td>Parentesco:</td><td>${emergencyContact.relationship_type?.name || inmate.emergency_contact_relationship?.name || 'N/A'}</td>
          <td>Tel&eacute;fono:</td><td>${emergencyContact.phone || inmate.emergency_contact_phone || 'N/A'}</td>
        </tr>
        <tr><td>Direcci&oacute;n:</td><td colspan="3">${emergencyContact.address || inmate.emergency_contact_address || 'N/A'}</td></tr>
      </table>

      <div class="fingerprints-container">
        <div class="fingerprints-label">HUELLAS DIGITALES MANO DERECHA DEL INTERNO</div>
        <div class="fingerprints-row">${renderFingerprintBoxes(rightHandPrints)}</div>

        <div style="text-align: center; margin: 20px 0;">
          <div style="border-top: 1px solid #333; display: inline-block; padding-top: 5px; min-width: 300px;">
            (F) ${fullName}
          </div>
          <div style="font-weight: bold; font-size: 9pt; margin-top: 5px;">INTERNO</div>
        </div>

        <div class="fingerprints-label">HUELLAS DIGITALES MANO IZQUIERDA DEL INTERNO</div>
        <div class="fingerprints-row">${renderFingerprintBoxes(leftHandPrints)}</div>
      </div>

      <div class="signatures">
        <div class="signature-box">
          <div class="signature-line">(F) _______________________</div>
          <div style="font-weight: bold; margin-top: 5px; font-size: 9pt;">OPERADOR RESPONSABLE</div>
        </div>
        <div class="signature-box">
          <div class="signature-line">(F) _______________________</div>
          <div style="font-weight: bold; margin-top: 5px; font-size: 9pt;">FICHADOR RESPONSABLE</div>
        </div>
      </div>
    </div>`;

  return page1 + page2;
}

// ─── Batch Document Generation ──────────────────────────────────────

export interface BatchPrintOptions {
  watermark?: string; // e.g. "CONFIDENCIAL"
}

/**
 * Generates a full HTML document ready for printing, containing one or more inmate profiles.
 */
export function generateBatchPrintHTML(
  inmates: any[],
  options: BatchPrintOptions = {}
): string {
  const firstInmate = inmates[0];
  const titleText =
    inmates.length === 1
      ? `FICHA DEL INTERNO - ${firstInmate?.full_name || ''}`
      : `FICHAS DE INTERNOS (${inmates.length})`;

  const allPages = inmates.map((inmate) => generateInmatePages(inmate)).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${titleText}</title>
  <style>${getPrintStyles(options.watermark)}</style>
</head>
<body>
${allPages}
</body>
</html>`;
}
