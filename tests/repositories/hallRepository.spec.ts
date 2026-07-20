import { describe, it, expect } from "vitest";
import { hallRepository } from "@/repositories/hallRepository";

describe("hallRepository", () => {
  it("creates and reads a hall", async () => {
    const id = await hallRepository.create({ name: "Boulderhalle Nord", address: "Musterstr. 1" });

    const hall = await hallRepository.get(id);

    expect(hall).toBeDefined();
    expect(hall?.name).toBe("Boulderhalle Nord");
    expect(hall?.address).toBe("Musterstr. 1");
    expect(hall?.createdAt).toBeTruthy();
    expect(hall?.updatedAt).toBeTruthy();
  });

  it("lists all halls", async () => {
    await hallRepository.create({ name: "Halle A", address: "Adresse A" });
    await hallRepository.create({ name: "Halle B", address: "Adresse B" });

    const halls = await hallRepository.getAll();

    expect(halls).toHaveLength(2);
  });

  it("updates a hall and refreshes updatedAt", async () => {
    const id = await hallRepository.create({ name: "Halle", address: "Adresse" });
    const before = await hallRepository.get(id);

    await new Promise((resolve) => setTimeout(resolve, 5));
    await hallRepository.update(id, { name: "Neuer Name" });
    const after = await hallRepository.get(id);

    expect(after?.name).toBe("Neuer Name");
    expect(after?.updatedAt).not.toBe(before?.updatedAt);
    expect(after?.createdAt).toBe(before?.createdAt);
  });

  it("deletes a hall", async () => {
    const id = await hallRepository.create({ name: "Halle", address: "Adresse" });

    await hallRepository.delete(id);
    const hall = await hallRepository.get(id);

    expect(hall).toBeUndefined();
  });
});
