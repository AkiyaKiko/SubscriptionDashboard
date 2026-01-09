-- CreateTable
CREATE TABLE "links" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "uri" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "admins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "links_link_key" ON "links"("link");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_uri_key" ON "subscriptions"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");
