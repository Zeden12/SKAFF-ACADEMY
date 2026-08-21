import type { LearningMaterial, LearningMaterialStatus, LearningMaterialType } from "@/lib/types";
import { learningMaterials } from "@/lib/mock-data/materials";

export interface CreateMaterialInput {
  moduleId: string;
  classGroupId: string;
  title: string;
  description?: string;
  type: LearningMaterialType;
  status: LearningMaterialStatus;
  fileUrl?: string;
  fileSizeKb?: number;
  externalUrl?: string;
  uploadedByStaffId: string;
}

export type UpdateMaterialInput = Partial<Omit<CreateMaterialInput, "uploadedByStaffId">>;

export interface MaterialFilters {
  query?: string;
  moduleId?: string;
  classGroupId?: string;
  type?: LearningMaterialType;
  status?: LearningMaterialStatus;
}

function sortByNewest(items: LearningMaterial[]): LearningMaterial[] {
  return [...items].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

/**
 * Learning material data access. Mock-backed for now (in-memory array as a stand-in
 * database); swap the function bodies for real API calls later without changing any calling
 * UI code. Student-facing reads only ever return "published" materials — admin reads see
 * everything, since both sides go through this same module and array.
 */
export const materialsService = {
  // --- Student-facing (published only) ---

  async listMaterialsForModules(moduleIds: string[]): Promise<LearningMaterial[]> {
    const idSet = new Set(moduleIds);
    return sortByNewest(learningMaterials.filter((m) => idSet.has(m.moduleId) && m.status === "published"));
  },

  async listMaterialsForModule(moduleId: string): Promise<LearningMaterial[]> {
    return materialsService.listMaterialsForModules([moduleId]);
  },

  async listRecentMaterials(moduleIds: string[], limit = 3): Promise<LearningMaterial[]> {
    const materials = await materialsService.listMaterialsForModules(moduleIds);
    return materials.slice(0, limit);
  },

  // --- Admin-facing (all statuses) ---

  async listAllMaterials(filters: MaterialFilters = {}): Promise<LearningMaterial[]> {
    let results = learningMaterials;
    if (filters.moduleId) results = results.filter((m) => m.moduleId === filters.moduleId);
    if (filters.classGroupId) results = results.filter((m) => m.classGroupId === filters.classGroupId);
    if (filters.type) results = results.filter((m) => m.type === filters.type);
    if (filters.status) results = results.filter((m) => m.status === filters.status);
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(
        (m) => m.title.toLowerCase().includes(query) || m.description?.toLowerCase().includes(query)
      );
    }
    return sortByNewest(results);
  },

  async getMaterial(materialId: string): Promise<LearningMaterial | undefined> {
    return learningMaterials.find((m) => m.id === materialId);
  },

  async createMaterial(input: CreateMaterialInput): Promise<LearningMaterial> {
    const material: LearningMaterial = {
      id: `mat-${learningMaterials.length + 1}`,
      ...input,
      uploadedAt: new Date().toISOString(),
    };
    learningMaterials.push(material);
    return material;
  },

  async updateMaterial(materialId: string, updates: UpdateMaterialInput): Promise<LearningMaterial> {
    const material = learningMaterials.find((m) => m.id === materialId);
    if (!material) throw new Error(`Material ${materialId} was not found.`);
    Object.assign(material, updates);
    return material;
  },

  async changeMaterialStatus(materialId: string, status: LearningMaterialStatus): Promise<LearningMaterial> {
    return materialsService.updateMaterial(materialId, { status });
  },
};
