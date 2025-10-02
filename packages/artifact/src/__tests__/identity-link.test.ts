import { describe, it, expect } from "vitest";
import { IdentityLink } from "../identity-link";
import { generateTestId, generateTestDates } from "./test-utils";

describe("IdentityLink", () => {
  describe("Constructor", () => {
    it("should create an IdentityLink instance with all required properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const linkedAt = new Date();
      const props = {
        authUserId: generateTestId(),
        globalPlayerId: generateTestId(),
        linkedAt,
        createdAt,
        updatedAt,
      };

      const identityLink = new IdentityLink(props);

      expect(identityLink.authUserId).toBe(props.authUserId);
      expect(identityLink.globalPlayerId).toBe(props.globalPlayerId);
      expect(identityLink.linkedAt).toBe(props.linkedAt);
      expect(identityLink.createdAt).toBe(props.createdAt);
      expect(identityLink.updatedAt).toBe(props.updatedAt);
      expect(identityLink.id).toBe(""); // Default empty string when not provided
    });

    it("should create an IdentityLink instance with provided id", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const linkedAt = new Date();
      const props = {
        id,
        authUserId: generateTestId(),
        globalPlayerId: generateTestId(),
        linkedAt,
        createdAt,
        updatedAt,
      };

      const identityLink = new IdentityLink(props);

      expect(identityLink.id).toBe(id);
      expect(identityLink.authUserId).toBe(props.authUserId);
      expect(identityLink.globalPlayerId).toBe(props.globalPlayerId);
      expect(identityLink.linkedAt).toBe(props.linkedAt);
    });
  });

  describe("CRUD Operations", () => {
    it("should support Create operation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const linkedAt = new Date();
      const identityLinkData = {
        authUserId: generateTestId(),
        globalPlayerId: generateTestId(),
        linkedAt,
        createdAt,
        updatedAt,
      };

      const identityLink = new IdentityLink(identityLinkData);

      expect(identityLink).toBeInstanceOf(IdentityLink);
      expect(identityLink.authUserId).toBe(identityLinkData.authUserId);
      expect(identityLink.globalPlayerId).toBe(identityLinkData.globalPlayerId);
      expect(identityLink.linkedAt).toBe(identityLinkData.linkedAt);
    });

    it("should support Read operation by accessing properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const id = generateTestId();
      const authUserId = generateTestId();
      const globalPlayerId = generateTestId();
      const linkedAt = new Date();

      const identityLink = new IdentityLink({
        id,
        authUserId,
        globalPlayerId,
        linkedAt,
        createdAt,
        updatedAt,
      });

      // Read operations
      expect(identityLink.id).toBe(id);
      expect(identityLink.authUserId).toBe(authUserId);
      expect(identityLink.globalPlayerId).toBe(globalPlayerId);
      expect(identityLink.linkedAt).toBe(linkedAt);
      expect(identityLink.createdAt).toBe(createdAt);
      expect(identityLink.updatedAt).toBe(updatedAt);
    });

    it("should support Update operation by modifying properties", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const identityLink = new IdentityLink({
        id: generateTestId(),
        authUserId: generateTestId(),
        globalPlayerId: generateTestId(),
        linkedAt: new Date(),
        createdAt,
        updatedAt,
      });

      // Update operations (typically only updatedAt would change)
      const newUpdatedAt = new Date();

      identityLink.updatedAt = newUpdatedAt;

      expect(identityLink.updatedAt).toBe(newUpdatedAt);
    });

    it("should support Delete operation by clearing IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const identityLink = new IdentityLink({
        id: generateTestId(),
        authUserId: generateTestId(),
        globalPlayerId: generateTestId(),
        linkedAt: new Date(),
        createdAt,
        updatedAt,
      });

      // Simulate delete by clearing auth user ID (soft delete)
      identityLink.authUserId = "";

      expect(identityLink.authUserId).toBe("");
      // Other properties should remain for audit purposes
      expect(identityLink.id).toBeTruthy();
      expect(identityLink.globalPlayerId).toBeTruthy();
      expect(identityLink.linkedAt).toBeInstanceOf(Date);
      expect(identityLink.createdAt).toBe(createdAt);
      expect(identityLink.updatedAt).toBe(updatedAt);
    });
  });

  describe("Date Handling", () => {
    it("should handle various linkedAt dates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const dates = [
        new Date("2020-01-01"),
        new Date("2023-06-15T10:30:00Z"),
        new Date(),
        new Date(Date.now() + 86400000), // Tomorrow
      ];

      dates.forEach((linkedAt) => {
        const identityLink = new IdentityLink({
          authUserId: generateTestId(),
          globalPlayerId: generateTestId(),
          linkedAt,
          createdAt,
          updatedAt,
        });

        expect(identityLink.linkedAt).toBe(linkedAt);
        expect(identityLink.linkedAt).toBeInstanceOf(Date);
      });
    });

    it("should handle date edge cases", () => {
      const veryOldDate = new Date("1970-01-01");
      const futureDate = new Date("2099-12-31");
      const { createdAt, updatedAt } = generateTestDates();

      const identityLink = new IdentityLink({
        authUserId: generateTestId(),
        globalPlayerId: generateTestId(),
        linkedAt: veryOldDate,
        createdAt: veryOldDate,
        updatedAt: futureDate,
      });

      expect(identityLink.linkedAt).toBe(veryOldDate);
      expect(identityLink.createdAt).toBe(veryOldDate);
      expect(identityLink.updatedAt).toBe(futureDate);
    });
  });

  describe("ID Handling", () => {
    it("should handle various ID formats", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const idFormats = [
        "uuid-format-12345678-1234-1234-1234-123456789012",
        "simple-id",
        "user_123",
        "USER-456",
        "user.789",
        "123456789",
        "auth@user#id",
      ];

      idFormats.forEach((id) => {
        const identityLink = new IdentityLink({
          authUserId: id,
          globalPlayerId: id,
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        });

        expect(identityLink.authUserId).toBe(id);
        expect(identityLink.globalPlayerId).toBe(id);
      });
    });

    it("should handle empty string IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const identityLink = new IdentityLink({
        authUserId: "",
        globalPlayerId: "",
        linkedAt: new Date(),
        createdAt,
        updatedAt,
      });

      expect(identityLink.authUserId).toBe("");
      expect(identityLink.globalPlayerId).toBe("");
    });

    it("should handle very long IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const veryLongId = "a".repeat(1000);
      const identityLink = new IdentityLink({
        authUserId: veryLongId,
        globalPlayerId: veryLongId,
        linkedAt: new Date(),
        createdAt,
        updatedAt,
      });

      expect(identityLink.authUserId).toBe(veryLongId);
      expect(identityLink.globalPlayerId).toBe(veryLongId);
    });

    it("should handle special character IDs", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const specialIds = [
        "id-with-dashes",
        "id_with_underscores",
        "id.with.dots",
        "id123with456numbers",
        "ID-WITH-CAPS",
        "id with spaces",
        "id@with#special$chars",
      ];

      specialIds.forEach((id) => {
        const identityLink = new IdentityLink({
          authUserId: id,
          globalPlayerId: id,
          linkedAt: new Date(),
          createdAt: generateTestDates().createdAt,
          updatedAt: generateTestDates().updatedAt,
        });

        expect(identityLink.authUserId).toBe(id);
        expect(identityLink.globalPlayerId).toBe(id);
      });
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity after multiple updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const originalId = generateTestId();
      const originalAuthUserId = generateTestId();
      const originalGlobalPlayerId = generateTestId();
      const originalLinkedAt = new Date();

      const identityLink = new IdentityLink({
        id: originalId,
        authUserId: originalAuthUserId,
        globalPlayerId: originalGlobalPlayerId,
        linkedAt: originalLinkedAt,
        createdAt,
        updatedAt,
      });

      // Multiple updates (typically only updatedAt would change)
      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);
      const update3 = new Date(update2.getTime() + 1000);

      identityLink.updatedAt = update1;
      identityLink.updatedAt = update2;
      identityLink.updatedAt = update3;

      // Core identifiers should not change
      expect(identityLink.id).toBe(originalId);
      expect(identityLink.authUserId).toBe(originalAuthUserId);
      expect(identityLink.globalPlayerId).toBe(originalGlobalPlayerId);
      expect(identityLink.linkedAt).toBe(originalLinkedAt);
      expect(identityLink.updatedAt).toBe(update3);
      expect(identityLink.createdAt).toBe(createdAt);
    });

    it("should handle concurrent-like updates", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const identityLink = new IdentityLink({
        authUserId: generateTestId(),
        globalPlayerId: generateTestId(),
        linkedAt: new Date(),
        createdAt,
        updatedAt,
      });

      const update1 = new Date();
      const update2 = new Date(update1.getTime() + 1000);

      identityLink.updatedAt = update1;
      identityLink.updatedAt = update2;

      expect(identityLink.updatedAt).toBe(update2);
    });
  });

  describe("Business Logic", () => {
    it("should support link filtering by auth user", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const authUserId = generateTestId();

      const links = [
        new IdentityLink({
          authUserId,
          globalPlayerId: generateTestId(),
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
        new IdentityLink({
          authUserId: generateTestId(),
          globalPlayerId: generateTestId(),
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
        new IdentityLink({
          authUserId,
          globalPlayerId: generateTestId(),
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
      ];

      const userLinks = links.filter((l) => l.authUserId === authUserId);

      expect(userLinks).toHaveLength(2);
    });

    it("should support link filtering by global player", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const globalPlayerId = generateTestId();

      const links = [
        new IdentityLink({
          authUserId: generateTestId(),
          globalPlayerId,
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
        new IdentityLink({
          authUserId: generateTestId(),
          globalPlayerId: generateTestId(),
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
        new IdentityLink({
          authUserId: generateTestId(),
          globalPlayerId,
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
      ];

      const playerLinks = links.filter(
        (l) => l.globalPlayerId === globalPlayerId
      );

      expect(playerLinks).toHaveLength(2);
    });

    it("should support link uniqueness validation", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const links = [
        new IdentityLink({
          id: "link-1",
          authUserId: "auth-1",
          globalPlayerId: "global-1",
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
        new IdentityLink({
          id: "link-2",
          authUserId: "auth-2",
          globalPlayerId: "global-2",
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
        new IdentityLink({
          id: "link-3",
          authUserId: "auth-3",
          globalPlayerId: "global-3",
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
      ];

      const ids = links.map((l) => l.id);
      const uniqueIds = [...new Set(ids)];
      const authUserIds = links.map((l) => l.authUserId);
      const uniqueAuthUserIds = [...new Set(authUserIds)];
      const globalPlayerIds = links.map((l) => l.globalPlayerId);
      const uniqueGlobalPlayerIds = [...new Set(globalPlayerIds)];

      expect(ids).toHaveLength(3);
      expect(uniqueIds).toHaveLength(3);
      expect(authUserIds).toHaveLength(3);
      expect(uniqueAuthUserIds).toHaveLength(3);
      expect(globalPlayerIds).toHaveLength(3);
      expect(uniqueGlobalPlayerIds).toHaveLength(3);
    });

    it("should support link creation time sorting", () => {
      const baseDate = new Date();
      const date1 = new Date(baseDate.getTime() - 3000);
      const date2 = new Date(baseDate.getTime() - 2000);
      const date3 = new Date(baseDate.getTime() - 1000);

      const links = [
        new IdentityLink({
          authUserId: "auth-2",
          globalPlayerId: "global-2",
          linkedAt: date2,
          createdAt: date2,
          updatedAt: date2,
        }),
        new IdentityLink({
          authUserId: "auth-1",
          globalPlayerId: "global-1",
          linkedAt: date1,
          createdAt: date1,
          updatedAt: date1,
        }),
        new IdentityLink({
          authUserId: "auth-3",
          globalPlayerId: "global-3",
          linkedAt: date3,
          createdAt: date3,
          updatedAt: date3,
        }),
      ];

      links.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      expect(links[0].authUserId).toBe("auth-1");
      expect(links[1].authUserId).toBe("auth-2");
      expect(links[2].authUserId).toBe("auth-3");
    });

    it("should support link time sorting", () => {
      const baseDate = new Date();
      const date1 = new Date(baseDate.getTime() - 3000);
      const date2 = new Date(baseDate.getTime() - 2000);
      const date3 = new Date(baseDate.getTime() - 1000);
      const { createdAt, updatedAt } = generateTestDates();

      const links = [
        new IdentityLink({
          authUserId: "auth-2",
          globalPlayerId: "global-2",
          linkedAt: date2,
          createdAt,
          updatedAt,
        }),
        new IdentityLink({
          authUserId: "auth-1",
          globalPlayerId: "global-1",
          linkedAt: date1,
          createdAt,
          updatedAt,
        }),
        new IdentityLink({
          authUserId: "auth-3",
          globalPlayerId: "global-3",
          linkedAt: date3,
          createdAt,
          updatedAt,
        }),
      ];

      links.sort((a, b) => a.linkedAt.getTime() - b.linkedAt.getTime());

      expect(links[0].authUserId).toBe("auth-1");
      expect(links[1].authUserId).toBe("auth-2");
      expect(links[2].authUserId).toBe("auth-3");
    });

    it("should support active link detection", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const links = [
        new IdentityLink({
          authUserId: "active-1",
          globalPlayerId: "global-1",
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
        new IdentityLink({
          authUserId: "",
          globalPlayerId: "global-2",
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }), // Inactive
        new IdentityLink({
          authUserId: "active-3",
          globalPlayerId: "",
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }), // Inactive
        new IdentityLink({
          authUserId: "active-4",
          globalPlayerId: "global-4",
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
      ];

      const activeLinks = links.filter(
        (l) => l.authUserId !== "" && l.globalPlayerId !== ""
      );
      const inactiveLinks = links.filter(
        (l) => l.authUserId === "" || l.globalPlayerId === ""
      );

      expect(activeLinks).toHaveLength(2);
      expect(inactiveLinks).toHaveLength(2);
    });

    it("should support user-to-player mapping", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const links = [
        new IdentityLink({
          authUserId: "auth-1",
          globalPlayerId: "global-1",
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
        new IdentityLink({
          authUserId: "auth-2",
          globalPlayerId: "global-2",
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
        new IdentityLink({
          authUserId: "auth-3",
          globalPlayerId: "global-1",
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
      ];

      // Map auth users to global players
      const userToPlayerMap = links.reduce(
        (map, link) => {
          map[link.authUserId] = link.globalPlayerId;
          return map;
        },
        {} as Record<string, string>
      );

      expect(userToPlayerMap["auth-1"]).toBe("global-1");
      expect(userToPlayerMap["auth-2"]).toBe("global-2");
      expect(userToPlayerMap["auth-3"]).toBe("global-1");
    });

    it("should support multi-auth user detection", () => {
      const { createdAt, updatedAt } = generateTestDates();
      const globalPlayerId = "shared-player";

      const links = [
        new IdentityLink({
          authUserId: "auth-1",
          globalPlayerId,
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
        new IdentityLink({
          authUserId: "auth-2",
          globalPlayerId,
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
        new IdentityLink({
          authUserId: "auth-3",
          globalPlayerId: "other-player",
          linkedAt: new Date(),
          createdAt,
          updatedAt,
        }),
      ];

      const sharedPlayerLinks = links.filter(
        (l) => l.globalPlayerId === globalPlayerId
      );
      const authUsers = sharedPlayerLinks.map((l) => l.authUserId);

      expect(sharedPlayerLinks).toHaveLength(2);
      expect(authUsers).toEqual(["auth-1", "auth-2"]);
    });
  });
});
